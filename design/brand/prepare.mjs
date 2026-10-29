import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

/**
 * Prepares the logotypes for the web: the short mark (P2S) and the long
 * wordmark (push2solutions).
 *
 *   bun run brand:prepare
 *
 * The source is a traced SVG with generator metadata, three decimal places of
 * coordinate precision and a canvas padded well beyond the artwork. This keeps
 * the paths and their layering, and:
 *
 * - rounds every coordinate to one decimal place, far below a device pixel at
 *   any size the mark is shown, which roughly halves the file;
 * - crops the view box to the artwork, so the mark sizes by its ink;
 * - writes `public/brand/logo-short.svg` and `public/brand/logo-long.svg` for
 *   plain `<img>` use, such as the header;
 * - writes `src/components/brand/logo-geometry.ts`, the short mark's paths as data,
 *   grouped letter by letter, for components that animate the mark one
 *   letter at a time.
 */

const root = fileURLToPath(new URL("../..", import.meta.url));
const source = readFileSync(join(root, "design", "brand", "logo-short.svg"), "utf8");

/** Breathing room around the artwork's ink, in source units. */
const PADDING = 6;

const round = (d) => d.replace(/-?\d+\.\d+/g, (value) => String(Math.round(Number(value) * 10) / 10));

const paths = [...source.matchAll(/<path\s+([^>]*?)\/?>/g)].map(([, attributes]) => {
  const read = (name) => attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
  const [, x, y] = read("transform").match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);

  return { id: read("id"), fill: read("fill"), x: Number(x), y: Number(y), d: round(read("d")) };
});

/**
 * Which layer each path belongs to, from its id in the source. The mark is
 * built back to front: the black silhouette, the violet extrusion, the letters.
 */
const LAYERS = {
  silhouette: ["contorno-negro"],
  extrusion: ["sombra-p", "sombra-interior-p", "sombra-2", "sombra-s-superior", "sombra-s-inferior"],
  p: ["letra-p"],
  two: ["numero-2"],
  s: ["letra-s"],
};

/**
 * The same paths regrouped by letter, in reading order: each letter's face and
 * the pieces of extrusion that belong to it. The silhouette is one shape
 * shared by all three, so it is not listed here.
 */
const LETTERS = [
  { key: "p", face: "letra-p", extrusion: ["sombra-p", "sombra-interior-p"] },
  { key: "two", face: "numero-2", extrusion: ["sombra-2"] },
  { key: "s", face: "letra-s", extrusion: ["sombra-s-superior", "sombra-s-inferior"] },
];

const byId = new Map(paths.map((path) => [path.id, path]));
for (const ids of Object.values(LAYERS)) {
  for (const id of ids) {
    if (!byId.has(id)) {
      throw new Error(`Logo source has no path with id "${id}"`);
    }
  }
}

const [, sourceWidth, sourceHeight] = source.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);

const pathElement = ({ fill, x, y, d }) =>
  `<path fill="${fill}" fill-rule="evenodd" transform="translate(${x} ${y})" d="${d}"/>`;

/* Find the artwork's bounds by rendering it and reading the alpha channel. */
const uncropped = `<svg xmlns="http://www.w3.org/2000/svg" width="${sourceWidth}" height="${sourceHeight}" viewBox="0 0 ${sourceWidth} ${sourceHeight}">${paths.map(pathElement).join("")}</svg>`;
const { data, info } = await sharp(Buffer.from(uncropped)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

let left = info.width;
let top = info.height;
let right = 0;
let bottom = 0;
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    if (data[(y * info.width + x) * 4 + 3] > 0) {
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
}

const viewBox = {
  x: left - PADDING,
  y: top - PADDING,
  width: right - left + 1 + PADDING * 2,
  height: bottom - top + 1 + PADDING * 2,
};

/**
 * Bounds of a path in view box units, from its coordinates. Bezier control
 * points can sit slightly outside the curve, so this can only err on the
 * generous side, which is the right side for a fill that must cover the shape.
 */
function bounds({ x, y, d }) {
  const numbers = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const xs = numbers.filter((_, index) => index % 2 === 0);
  const ys = numbers.filter((_, index) => index % 2 === 1);
  return {
    x: Math.min(...xs) + x,
    y: Math.min(...ys) + y,
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

const round1 = (value) => Math.round(value * 10) / 10;
const roundBounds = (box) => Object.fromEntries(Object.entries(box).map(([key, value]) => [key, round1(value)]));

const viewBoxAttribute = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
const ordered = Object.values(LAYERS).flat().map((id) => byId.get(id));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxAttribute}" width="${viewBox.width}" height="${viewBox.height}">${ordered.map(pathElement).join("")}</svg>\n`;
writeFileSync(join(root, "public", "brand", "logo-short.svg"), svg);

const literal = ({ fill, x, y, d }) => `{ fill: "${fill}", x: ${x}, y: ${y}, d: "${d}" }`;

const lettersData = LETTERS.map(({ key, face, extrusion }) => {
  const facePath = byId.get(face);
  const boxes = [facePath, ...extrusion.map((id) => byId.get(id))].map(bounds);
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const fillBounds = {
    x: left,
    y: top,
    width: Math.max(...boxes.map((box) => box.x + box.width)) - left,
    height: Math.max(...boxes.map((box) => box.y + box.height)) - top,
  };

  return `  {
    key: "${key}",
    face: ${literal(facePath)},
    fillBounds: ${JSON.stringify(roundBounds(fillBounds))},
    extrusion: [
${extrusion.map((id) => `      ${literal(byId.get(id))},`).join("\n")}
    ],
  },`;
}).join("\n");

const geometryModule = `/*
  Generated by design/brand/prepare.mjs from design/brand/logo-short.svg.
  Do not edit by hand: change the source and run \`bun run brand:prepare\`.
*/

/**
 * One filled path of the logotype, positioned by a translation.
 */
export interface LogoPath {
  readonly fill: string;
  readonly x: number;
  readonly y: number;
  readonly d: string;
}

/**
 * One letter of the logotype: its face, the violet extrusion under it, and
 * the bounds of both together in view box units, which is what a fill sweeping
 * the whole letter must cover.
 */
export interface LogoLetter {
  readonly key: string;
  readonly face: LogoPath;
  readonly fillBounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
  readonly extrusion: readonly LogoPath[];
}

/** View box of the logotype, cropped to its ink. */
export const LOGO_VIEWBOX = ${JSON.stringify(viewBox)} as const;

/** The black silhouette behind all three letters, as one shape. */
export const LOGO_SILHOUETTE: LogoPath = ${literal(byId.get(LAYERS.silhouette[0]))};

/** The letters in reading order. */
export const LOGO_LETTERS: readonly LogoLetter[] = [
${lettersData}
];
`;

writeFileSync(join(root, "src", "components", "brand", "logo-geometry.ts"), geometryModule);

const before = Buffer.byteLength(source);
const after = Buffer.byteLength(svg);
console.log(`✓ logo-short.svg  ${viewBox.width}×${viewBox.height}  ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB`);
console.log("✓ logo-geometry.ts");

/**
 * Prepares a logotype that is only ever shown whole: rounded, cropped to its
 * ink, and written in its source order. No geometry module, since nothing
 * animates it piece by piece.
 *
 * @param {string} name - File stem in `design/brand/` and `public/brand/`.
 */
async function prepareWhole(name) {
  const wholeSource = readFileSync(join(root, "design", "brand", `${name}.svg`), "utf8");
  const wholePaths = [...wholeSource.matchAll(/<path\s+([^>]*?)\/?>/g)].map(([, attributes]) => {
    const read = (attribute) => attributes.match(new RegExp(`(?:^|\\s)${attribute}="([^"]*)"`))?.[1];
    const [, px, py] = read("transform").match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
    return { fill: read("fill"), x: Number(px), y: Number(py), d: round(read("d")) };
  });

  const [, width, height] = wholeSource.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
  const flat = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${wholePaths.map(pathElement).join("")}</svg>`;
  const raster = await sharp(Buffer.from(flat)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let minX = raster.info.width;
  let minY = raster.info.height;
  let maxX = 0;
  let maxY = 0;
  for (let py = 0; py < raster.info.height; py += 1) {
    for (let px = 0; px < raster.info.width; px += 1) {
      if (raster.data[(py * raster.info.width + px) * 4 + 3] > 0) {
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }
  }

  const box = {
    x: minX - PADDING,
    y: minY - PADDING,
    width: maxX - minX + 1 + PADDING * 2,
    height: maxY - minY + 1 + PADDING * 2,
  };

  const output = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" width="${box.width}" height="${box.height}">${wholePaths.map(pathElement).join("")}</svg>
`;
  writeFileSync(join(root, "public", "brand", `${name}.svg`), output);

  console.log(
    `✓ ${name}.svg  ${box.width}×${box.height}  ${(Buffer.byteLength(wholeSource) / 1024).toFixed(1)} KB → ${(Buffer.byteLength(output) / 1024).toFixed(1)} KB`,
  );
}

await prepareWhole("logo-long");
