import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

/**
 * Prepares the hero scene's artwork for the web.
 *
 *   bun run scene:prepare
 *
 * The source images arrive as generator exports: opaque-free PNGs on large,
 * mostly empty canvases with timestamped names. For each one this trims the
 * canvas to the artwork's alpha bounds, caps its size at what the scene can
 * ever display, gives it a name that says what it is, and writes it to
 * `public/scene/`. A manifest with every output's pixel size is written for the
 * scene to read, so no layout number is ever measured by hand twice.
 */

const root = fileURLToPath(new URL("../..", import.meta.url));
const sourceDir = join(root, "design", "scene", "source");
const outputDir = join(root, "public", "scene");
const manifestPath = join(root, "src", "content", "scene-manifest.json");

/**
 * Source file, output name, and the longest edge the scene will ever need.
 * The rig pieces are shown at up to roughly 900 CSS pixels wide on a 2x
 * screen; props and streaks far less.
 */
const ASSETS = [
  ["cat.png", "cat", 1200],
  ["rocket.png", "rocket", 1400],
  ["flame.png", "flame", 1400],
  ["cloud-cluster.png", "cloud-cluster", 1200],
  ["cloud-long.png", "cloud-long", 1200],
  ["cloud-puff.png", "cloud-puff", 1000],
  ["planet-glow.png", "planet-glow", 1000],
  ["planet-dark.png", "planet-dark", 700],
  ["sparkle-volt.png", "sparkle-volt", 240],
  ["sparkle-lilac.png", "sparkle-lilac", 240],
  ["orb-pale.png", "orb-pale", 160],
  ["orb-lilac.png", "orb-lilac", 200],
  ["orb-volt.png", "orb-volt", 200],
  ["streak-pulse-1.png", "streak-pulse-1", 700],
  ["streak-pulse-2.png", "streak-pulse-2", 700],
  ["streak-pulse-3.png", "streak-pulse-3", 600],
  ["streak-volt-1.png", "streak-volt-1", 700],
  ["streak-volt-2.png", "streak-volt-2", 700],
  ["streak-volt-3.png", "streak-volt-3", 600],
  ["streak-lilac-1.png", "streak-lilac-1", 700],
  ["streak-lilac-2.png", "streak-lilac-2", 700],
  ["streak-lilac-3.png", "streak-lilac-3", 600],
];

/** Alpha below which a pixel counts as empty when finding the artwork's bounds. */
const ALPHA_FLOOR = 8;

/**
 * Finds the bounding box of every pixel with meaningful alpha.
 *
 * @param {string} file
 * @returns {Promise<{ left: number, top: number, width: number, height: number }>}
 */
async function alphaBounds(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] > ALPHA_FLOOR) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

mkdirSync(outputDir, { recursive: true });

const manifest = {};

for (const [source, name, longest] of ASSETS) {
  const input = join(sourceDir, source);
  const bounds = await alphaBounds(input);
  const scale = Math.min(1, longest / Math.max(bounds.width, bounds.height));
  const width = Math.round(bounds.width * scale);
  const height = Math.round(bounds.height * scale);

  const { size } = await sharp(input)
    .extract(bounds)
    .resize({ width, height })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(join(outputDir, `${name}.png`));

  manifest[name] = { src: `/scene/${name}.png`, width, height };
  console.log(`✓ ${name}.png  ${width}×${height}  ${(size / 1024).toFixed(0)} KB`);
}

/*
  The full illustration the pieces were cut from, kept only so the review page
  can overlay it on the assembled scene. A JPEG: it has no transparency to keep.
*/
await sharp(join(sourceDir, "reference.png"))
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(join(outputDir, "reference.jpg"));
console.log("✓ reference.jpg");

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ manifest (${Object.keys(manifest).length} assets)`);
