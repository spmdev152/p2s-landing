import manifest from "@/content/scene-manifest.json";

/**
 * Every asset the preparation step publishes, by name.
 */
export type SceneAssetName = keyof typeof manifest;

/**
 * The stage is laid out in the pixel space of the reference illustration the
 * artwork was generated from, so every number below can be checked against it
 * directly. The component converts them to percentages, which is what makes
 * the scene fluid.
 */
export const STAGE = { width: 1672, height: 941 } as const;

/**
 * Angle of the rocket's long axis, in degrees below the horizontal, measured on
 * the artwork. Everything that streams past the rocket travels along it.
 */
export const FLIGHT_ANGLE = 27.5;

/**
 * One image placed on the stage.
 */
export interface Placement {
  /** Asset to draw. */
  readonly asset: SceneAssetName;
  /** Left edge, in stage pixels. */
  readonly x: number;
  /** Top edge, in stage pixels. */
  readonly y: number;
  /** Width, in stage pixels. Height follows from the asset's aspect ratio. */
  readonly w: number;
  /** Rotation in degrees, around {@link Placement.origin}. */
  readonly rotate?: number;
  /** Transform origin as fractions of the image box. Defaults to the centre. */
  readonly origin?: readonly [number, number];
  /** Opacity, for layers pushed back by atmosphere. */
  readonly opacity?: number;
}

/**
 * A placement that drifts across the stage on a loop, for parallax.
 */
export interface Drifter extends Placement {
  /** Seconds to cross the stage once. Lower is nearer. */
  readonly duration: number;
}

/**
 * A placement that pulses in place.
 */
export interface Twinkler extends Placement {
  /** Seconds per pulse. */
  readonly duration: number;
  /** Seconds of offset, so neighbours never pulse together. */
  readonly delay: number;
}

/**
 * A streak of speed that crosses the stage along the flight axis.
 */
export interface Streak {
  readonly asset: SceneAssetName;
  /** Where the streak enters, in stage pixels. */
  readonly x: number;
  readonly y: number;
  /** Length, in stage pixels. */
  readonly w: number;
  /** Seconds per crossing. */
  readonly duration: number;
  /** Seconds of offset into the loop. */
  readonly delay: number;
}

/* The far sky ----------------------------------------------------------------- */

export const planets: readonly Placement[] = [
  { asset: "planet-glow", x: -190, y: -440, w: 720 },
  { asset: "planet-dark", x: 1478, y: 163, w: 128 },
];

export const orbs: readonly Twinkler[] = [
  { asset: "orb-lilac", x: 1188, y: 196, w: 22, duration: 5.2, delay: -1.3 },
  { asset: "orb-volt", x: 402, y: 118, w: 16, duration: 4.4, delay: -2.8 },
  { asset: "orb-pale", x: 1606, y: 402, w: 14, duration: 6.1, delay: -0.6 },
];

export const sparkles: readonly Twinkler[] = [
  { asset: "sparkle-volt", x: 1236, y: 70, w: 52, duration: 2.8, delay: 0 },
  { asset: "sparkle-lilac", x: 1411, y: 92, w: 48, duration: 3.4, delay: -1.1 },
  { asset: "sparkle-lilac", x: 616, y: 67, w: 36, duration: 3.1, delay: -2.2 },
  { asset: "sparkle-volt", x: 539, y: 296, w: 50, duration: 2.5, delay: -0.7 },
  { asset: "sparkle-volt", x: 1117, y: 657, w: 46, duration: 3.7, delay: -1.8 },
  { asset: "sparkle-lilac", x: 136, y: 102, w: 26, duration: 2.9, delay: -0.4 },
];

/* Clouds, back to front --------------------------------------------------------- */

/** Far away: small, faint and slow, so the sky has depth between the stars and the rig. */
export const cloudsFar: readonly Drifter[] = [
  { asset: "cloud-puff", x: 900, y: 60, w: 190, duration: 110, opacity: 0.45 },
  { asset: "cloud-long", x: 1240, y: 380, w: 230, duration: 120, opacity: 0.4 },
  { asset: "cloud-puff", x: 60, y: 40, w: 150, duration: 100, opacity: 0.4 },
];

/**
 * Behind the rocket: slow, and dimmed a touch by distance. Kept to the lower
 * band and the top-left corner, so the dark sky around the rider, which is what
 * makes the rig read, stays clear however the loop falls.
 */
export const cloudsBack: readonly Drifter[] = [
  { asset: "cloud-puff", x: 245, y: 150, w: 280, duration: 70, opacity: 0.9 },
  { asset: "cloud-long", x: 1405, y: 520, w: 282, duration: 64, opacity: 0.9 },
  { asset: "cloud-cluster", x: -130, y: 360, w: 580, duration: 58 },
  { asset: "cloud-long", x: -90, y: 600, w: 520, duration: 52 },
];

/**
 * Between the headline and the rig: a couple of clouds at mid height that
 * occasionally sail across the lower lines of the hero headline, which is what
 * puts the type inside the sky rather than on top of it.
 */
export const cloudsMid: readonly Drifter[] = [
  { asset: "cloud-puff", x: 520, y: 400, w: 230, duration: 46 },
  { asset: "cloud-long", x: 40, y: 318, w: 290, duration: 54, opacity: 0.95 },
];

/** In front of the flame's tail: faster, full strength, along the bottom edge. */
export const cloudsFront: readonly Drifter[] = [
  { asset: "cloud-puff", x: 392, y: 818, w: 452, duration: 30 },
  { asset: "cloud-cluster", x: 996, y: 700, w: 740, duration: 36 },
  { asset: "cloud-long", x: -80, y: 836, w: 520, duration: 26 },
];

/* Speed lines ----------------------------------------------------------------- */

export const streaks: readonly Streak[] = [
  { asset: "streak-pulse-1", x: 1480, y: -40, w: 230, duration: 1.9, delay: -0.2 },
  { asset: "streak-volt-2", x: 1700, y: 120, w: 170, duration: 1.5, delay: -1.1 },
  { asset: "streak-lilac-1", x: 1260, y: -120, w: 200, duration: 2.3, delay: -1.7 },
  { asset: "streak-pulse-2", x: 1720, y: 330, w: 250, duration: 2.1, delay: -0.8 },
  { asset: "streak-volt-3", x: 1020, y: -160, w: 150, duration: 1.7, delay: -1.4 },
  { asset: "streak-lilac-2", x: 1760, y: 520, w: 190, duration: 2.5, delay: -2.0 },
  { asset: "streak-pulse-3", x: 820, y: -200, w: 160, duration: 2.0, delay: -0.5 },
  { asset: "streak-volt-1", x: 1560, y: 30, w: 210, duration: 2.4, delay: -1.9 },
  { asset: "streak-lilac-3", x: 1700, y: 700, w: 150, duration: 1.8, delay: -0.3 },
];

/* The rig: flame, rocket, rider ------------------------------------------------ */

/**
 * Places an asset so that a point inside it, given as fractions of its box,
 * lands on a point of the stage. Rotation happens around that same point.
 *
 * @param asset - Asset to place.
 * @param anchor - Fractions of the asset's box: the point to pin.
 * @param at - Stage point the anchor is pinned to.
 * @param w - Width on the stage.
 * @param rotate - Rotation around the anchor, in degrees.
 */
function pinned(
  asset: SceneAssetName,
  anchor: readonly [number, number],
  at: { readonly x: number; readonly y: number },
  w: number,
  rotate: number,
): Placement {
  const h = w * (manifest[asset].height / manifest[asset].width);
  return { asset, x: at.x - anchor[0] * w, y: at.y - anchor[1] * h, w, rotate, origin: anchor };
}

/** Centre of the nozzle's exit, in stage pixels. */
const nozzle = { x: 752, y: 648 } as const;

/**
 * The flame is pinned by its head just inside the nozzle, so the rocket's bell
 * hides the join, and turned to lie along the flight axis. The head's position
 * inside the artwork was measured from its alpha.
 *
 * Size and height are tuned against the flicker: at its tallest frames a tongue
 * near the head used to poke out under the bell's lower rim. Sitting a touch
 * higher and smaller keeps it hidden through the whole loop.
 */
export const flame = pinned("flame", [0.964, 0.384], { x: nozzle.x + 18, y: nozzle.y - 6 }, 764, -14);

export const rocket: Placement = { asset: "rocket", x: 612, y: 230, w: 864 };

/**
 * The rider sits astride the hull. It is drawn behind the rocket, so the hull
 * hides its underside and the far legs, and placed so its forepaws rest on the
 * top edge of the body, clear of the porthole. A slight tilt around its base
 * matches the rocket's pitch.
 */
export const cat: Placement = { asset: "cat", x: 676, y: 2, w: 470, rotate: -5, origin: [0.5, 1] };

/** Point the whole rig rocks around: the middle of the hull. */
export const rigPivot = { x: 1040, y: 470 } as const;
