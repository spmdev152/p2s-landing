/**
 * Side length of the fingerprint grid, in cells.
 *
 * An odd number is required for the mirror to produce a true centre column
 * rather than a seam down the middle of the mark.
 */
const GRID_SIZE = 9;

/**
 * Number of columns actually generated before the grid is mirrored.
 *
 * Only the left half plus the centre column are drawn from the generator; the
 * right half is a reflection. Symmetry is what makes a pseudo-random grid read
 * as a designed mark rather than as noise.
 */
const GENERATED_COLUMNS = Math.ceil(GRID_SIZE / 2);

/**
 * Probability that a generated cell is filled at all.
 */
const FILL_PROBABILITY = 0.46;

/**
 * Probability that a filled cell is promoted to the signal tier.
 */
const SIGNAL_PROBABILITY = 0.34;

/**
 * Visual weight of a filled cell.
 *
 * `structure` cells carry the silhouette of the mark, `signal` cells are the
 * few that are allowed to take the accent colour — the same two-accent rule the
 * rest of the system follows, applied inside a single graphic.
 */
export type FingerprintTier = "structure" | "signal";

/**
 * One filled cell of a fingerprint. Empty cells are never emitted.
 */
export interface FingerprintCell {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** Zero-based column, counted from the left edge. */
  readonly column: number;
  /** Zero-based row, counted from the top edge. */
  readonly row: number;
  /** Visual weight of the cell. */
  readonly tier: FingerprintTier;
}

/**
 * A deterministic geometric mark derived from a project identifier.
 */
export interface Fingerprint {
  /** Side length of the grid, in cells. Doubles as the SVG viewBox extent. */
  readonly size: number;
  /** Every filled cell, in row-major order. */
  readonly cells: readonly FingerprintCell[];
}

/**
 * Hashes a string into a 32 bit unsigned integer using FNV-1a.
 *
 * @param seed - The string to hash.
 * @returns An unsigned 32 bit hash of the input.
 */
function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let position = 0; position < seed.length; position += 1) {
    hash ^= seed.charCodeAt(position);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Creates a seeded pseudo-random number generator.
 *
 * `Math.random` cannot be used here: the mark is rendered on the server and
 * again on the client, and a different grid on each pass would trip React's
 * hydration check. A seeded generator makes the output a pure function of the
 * project identifier instead.
 *
 * @param seed - Initial state of the generator.
 * @returns A function yielding successive values within `[0, 1)`.
 */
function createGenerator(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds the geometric mark that identifies a project.
 *
 * The grid is generated once for the left half and mirrored, so every project
 * gets a unique, vertically symmetric mark for free — adding a project to the
 * content file is enough, nothing has to be drawn by hand.
 *
 * @param seed - A value stable for the lifetime of the project, normally its id.
 * @returns The filled cells of the mark and the grid they sit on.
 */
export function buildFingerprint(seed: string): Fingerprint {
  const next = createGenerator(hashSeed(seed));
  const cells: FingerprintCell[] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GENERATED_COLUMNS; column += 1) {
      if (next() >= FILL_PROBABILITY) {
        continue;
      }

      const tier: FingerprintTier = next() < SIGNAL_PROBABILITY ? "signal" : "structure";
      const mirroredColumn = GRID_SIZE - 1 - column;

      cells.push({ id: `${row}-${column}`, column, row, tier });

      if (mirroredColumn !== column) {
        cells.push({ id: `${row}-${mirroredColumn}`, column: mirroredColumn, row, tier });
      }
    }
  }

  return { size: GRID_SIZE, cells };
}
