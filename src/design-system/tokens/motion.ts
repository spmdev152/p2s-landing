/**
 * A cubic bezier curve expressed as the four control point coordinates accepted
 * by both CSS and Motion.
 */
export type CubicBezier = [number, number, number, number];

/**
 * Named easing curves for the p2s motion language.
 *
 * The values mirror the `--ease-*` custom properties declared in
 * `design-system/styles/theme.css`; this module is the JavaScript facing copy so
 * that Motion transitions and CSS transitions stay visually identical.
 */
export const easing: Record<"quick" | "snap" | "inOutQuick", CubicBezier> = {
  quick: [0.25, 0.1, 0.25, 1],
  snap: [0.16, 1, 0.3, 1],
  inOutQuick: [0.455, 0.03, 0.515, 0.955],
};

/**
 * Duration scale in seconds.
 *
 * `instant` and `quick` belong to direct manipulation (hover, press), `base` to
 * element entrances, and `slow`/`glacial` to orchestrated page reveals.
 */
export const duration: Record<"instant" | "quick" | "base" | "slow" | "glacial", number> = {
  instant: 0.12,
  quick: 0.24,
  base: 0.45,
  slow: 0.75,
  glacial: 1.05,
};

/**
 * Delay applied before the hero entrance choreography begins, in seconds.
 *
 * It gives the fixed header time to finish sliding into place so the two
 * sequences read as one continuous movement rather than two competing ones.
 */
export const heroEntranceDelay = 0.28;

/**
 * Per-character delay used by staggered display type reveals, in seconds.
 */
export const characterStagger = 0.016;
