import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

/**
 * Builds every app icon from the favicon artwork.
 *
 *   bun run favicon:prepare
 *
 * The source is `public/brand/logo-short-favicon.png`: the short mark on a
 * transparent square canvas. Its empty margin is trimmed first, so every icon
 * is laid out from the mark's own bounds.
 *
 * The mark is about two and a half times wider than it is tall. Fitted into a
 * square tab icon it filled the width but only six of sixteen pixels of
 * height, and read as a sliver. The tab icons therefore fill the square on
 * both axes, stretching the mark vertically: at those sizes it reads as p2s at
 * a glance, and the distortion is lost in the pixels. The larger icons, shown
 * on home screens and app launchers where the stretch would be obvious, keep
 * the mark's proportions.
 *
 * Writes:
 *
 * - `src/app/favicon.ico`: 16, 32 and 48px PNG entries, filled, for every
 *   browser's tab and bookmark bar, old ones included;
 * - `src/app/icon.png`: 512px, filled and transparent, which modern browsers
 *   scale down from for the tab;
 * - `src/app/apple-icon.png`: 180px on the page's `void`, since iOS fills
 *   transparency on home screen icons with black;
 * - `public/icons/icon-192.png` and `icon-512.png`, transparent, and
 *   `icon-maskable-512.png` on `void` with the mark inside the safe zone, for
 *   the web app manifest (`src/app/manifest.ts`).
 *
 * Next.js turns the three files in `src/app/` into the matching `<link>` tags.
 */

const root = fileURLToPath(new URL("../..", import.meta.url));
const source = join(root, "public", "brand", "logo-short-favicon.png");

/** The page background, `--color-void`. */
const VOID = "#0e0f12";

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const mark = await sharp(source).trim().png().toBuffer();

/**
 * Renders the mark centred on a square canvas.
 *
 * @param size - Canvas side, in pixels.
 * @param padding - Margin on each side, as a fraction of the side.
 * @param background - Canvas fill.
 * @returns The PNG bytes.
 */
async function square(size, padding, background = TRANSPARENT) {
  const inner = Math.round(size * (1 - 2 * padding));
  const fitted = await sharp(mark)
    .resize(inner, inner, { fit: "inside", kernel: "lanczos3" })
    .toBuffer();

  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: fitted, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Renders the mark stretched to fill a square canvas edge to edge.
 *
 * @param size - Canvas side, in pixels.
 * @returns The PNG bytes.
 */
function filled(size) {
  return sharp(mark).resize(size, size, { fit: "fill", kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Packs PNG images into one ICO file. Every browser in use reads PNG entries.
 *
 * @param images - Each image's side and PNG bytes.
 * @returns The ICO bytes.
 */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + 16 * index;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

const app = join(root, "src", "app");
const icons = join(root, "public", "icons");
mkdirSync(icons, { recursive: true });

const tabSizes = [16, 32, 48];
const tabImages = await Promise.all(tabSizes.map(async (size) => ({ size, data: await filled(size) })));
writeFileSync(join(app, "favicon.ico"), ico(tabImages));

writeFileSync(join(app, "icon.png"), await filled(512));
writeFileSync(join(app, "apple-icon.png"), await square(180, 0.12, VOID));

writeFileSync(join(icons, "icon-192.png"), await square(192, 0.04));
writeFileSync(join(icons, "icon-512.png"), await square(512, 0.04));
writeFileSync(join(icons, "icon-maskable-512.png"), await square(512, 0.15, VOID));

console.log("Wrote favicon.ico, icon.png, apple-icon.png and the manifest icons.");
