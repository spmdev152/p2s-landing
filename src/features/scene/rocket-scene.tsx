"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

import { cn } from "@/lib/cn";

import {
  cat,
  cloudsBack,
  cloudsFar,
  cloudsFront,
  cloudsMid,
  flame,
  FLIGHT_ANGLE,
  orbs,
  planets,
  rigPivot,
  rocket,
  sparkles,
  STAGE,
  streaks,
  type Drifter,
  type Twinkler,
} from "./scene-layout";
import { SceneImage, toHeight, toWidth } from "./scene-image";
import { Starfield } from "./starfield";

import "./scene.css";

/**
 * Depth of every layer, as z-index. Neither the stage nor the sky box has a
 * stacking context of its own, so content placed beside the stage can slot in
 * between: the hero headline sits at {@link SCENE_DEPTH.headline}, in front of
 * the back clouds and behind the mid clouds, the rig and the front clouds.
 */
export const SCENE_DEPTH = {
  sky: 10,
  farClouds: 20,
  backClouds: 30,
  streaks: 40,
  headline: 50,
  midClouds: 55,
  rig: 60,
  frontClouds: 70,
  interface: 80,
} as const;

/**
 * Props accepted by {@link RocketScene}.
 */
export interface RocketSceneProps {
  /** Freezes every loop in place. The scene also pauses itself off screen. */
  readonly paused?: boolean;
  /** Multiplier applied to every loop's tempo. */
  readonly speed?: number;
  /** Additional classes for the stage, which fills its positioned parent. */
  readonly className?: string;
  /**
   * Positions and sizes the rig: flame, rocket and rider. The box keeps the
   * illustration's aspect ratio, so it can be placed anywhere without the pieces
   * drifting apart. Defaults to filling the stage, as in the illustration.
   */
  readonly rigClassName?: string;
  /**
   * Which part of the sky stays in view when the stage is not the
   * illustration's shape, as fractions: `[0.5, 1]` keeps the bottom centre.
   */
  readonly skyAnchor?: readonly [number, number];
  /**
   * Widest the sky may grow, as a multiple of the stage's width, when covering
   * a tall stage. Past it the sky stops covering the top, which is left to the
   * gradient and the stars, rather than magnifying clouds beyond recognition.
   */
  readonly maxSkyScale?: number;
}

/** Distance a speed line travels, as a multiple of the sky's width. */
const STREAK_TRAVEL = 1.5;

/** Aspect ratio of the illustration the sky is composed in. */
const RATIO = STAGE.width / STAGE.height;

function subscribeVisibility(onChange: () => void): () => void {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * Animation variables for one loop.
 *
 * @param duration - Seconds per loop.
 * @param delay - Seconds of offset.
 */
function loop(duration: number, delay = 0): CSSProperties {
  return { "--loop-duration": `${duration}s`, "--loop-delay": `${delay}s` } as CSSProperties;
}

/**
 * A distance expressed as a share of the sky box's width, which the stage
 * publishes as `--box-w`.
 *
 * @param share - Fraction of the sky's width.
 */
function ofSky(share: number): string {
  return `calc(var(--box-w) * ${share.toFixed(4)})`;
}

/**
 * Animation variables for a drifter. It crosses from just past the right edge
 * to just past the left, and its delay is chosen so that at time zero the
 * first copy sits exactly where the layout puts it: the scene opens on the
 * composed picture. The second copy runs half a lap behind, which keeps the
 * sky equally full at every moment instead of emptying between passes.
 *
 * @param item - The drifter.
 * @param lap - Fraction of a crossing this copy lags the first by.
 */
function drift(item: Drifter, lap = 0): CSSProperties {
  const left = toWidth(item.x) / 100;
  const width = toWidth(item.w) / 100;
  const from = 1 - left;
  const to = -(left + width);
  const progressAtRest = from / (from - to);

  return {
    ...loop(item.duration, -(progressAtRest + lap) * item.duration),
    "--drift-from": ofSky(from),
    "--drift-to": ofSky(to),
  } as CSSProperties;
}

/** Copies of every drifter on screen at once, spaced evenly around the loop. */
const DRIFT_COPIES = [0, 0.5] as const;

/**
 * One drifting layer of clouds, with every cloud doubled half a lap apart.
 */
function CloudLayer({ clouds, depth }: { readonly clouds: readonly Drifter[]; readonly depth: number }) {
  return clouds.flatMap((cloud) =>
    DRIFT_COPIES.map((lap) => (
      <SceneImage
        key={`${cloud.asset}-${cloud.x}-${lap}`}
        placement={cloud}
        className="scene-loop scene-drift will-change-transform"
        style={{ ...drift(cloud, lap), zIndex: depth }}
      />
    )),
  );
}

function twinkle(item: Twinkler): CSSProperties {
  return loop(item.duration, item.delay);
}

/**
 * Size and position of the sky box inside the stage, in pixels.
 */
interface SkyBox {
  readonly left: number;
  readonly top: number;
  readonly width: number;
}

/**
 * Fits the sky over the stage the way `object-fit: cover` would, anchored at a
 * chosen point and capped at a maximum magnification.
 */
function fitSky(
  stageWidth: number,
  stageHeight: number,
  anchor: readonly [number, number],
  maxScale: number,
): SkyBox {
  const width = Math.min(Math.max(stageWidth, stageHeight * RATIO), stageWidth * maxScale);
  const height = width / RATIO;

  return {
    width,
    left: (stageWidth - width) * anchor[0],
    top: (stageHeight - height) * anchor[1],
  };
}

/**
 * The hero scene: a cat riding a rocket up through a violet night.
 *
 * Two boxes share the stage. The sky box holds everything but the rig, composed
 * in the illustration's own proportions and fitted over the stage like a cover
 * image, so clouds keep their spacing on any screen. The rig box holds flame,
 * rocket and rider, moving as one, and is placed independently so a layout can
 * put the rocket wherever its copy leaves room.
 *
 * Nearer layers move faster, which is all parallax is. Every loop is a CSS
 * animation on transform or opacity, with distances expressed against the sky's
 * width, which the stage measures and publishes as `--box-w`. The stage pauses
 * every loop when it is off screen or the tab is hidden, and drops them for
 * visitors who prefer reduced motion, leaving the composed picture.
 */
export function RocketScene({
  paused = false,
  speed = 1,
  className,
  rigClassName,
  skyAnchor = [0.5, 1],
  maxSkyScale = Number.POSITIVE_INFINITY,
}: RocketSceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [sky, setSky] = useState<SkyBox | null>(null);
  const inView = useInView(stageRef, { amount: 0.05 });
  const documentVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );

  const [anchorX, anchorY] = skyAnchor;

  useEffect(() => {
    const stage = stageRef.current;

    if (stage === null) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSky(fitSky(width, height, [anchorX, anchorY], maxSkyScale));
    });

    observer.observe(stage);
    return () => observer.disconnect();
  }, [anchorX, anchorY, maxSkyScale]);

  const halted = paused || !inView || !documentVisible;
  const slope = Math.tan((FLIGHT_ANGLE * Math.PI) / 180);

  const skyStyle: CSSProperties =
    sky === null
      ? { left: 0, bottom: 0, width: "100%", aspectRatio: `${STAGE.width} / ${STAGE.height}` }
      : ({
          left: sky.left,
          top: sky.top,
          width: sky.width,
          aspectRatio: `${STAGE.width} / ${STAGE.height}`,
          "--box-w": `${sky.width}px`,
        } as CSSProperties);

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label="A grinning cat rides a rocket up through a violet night sky, past clouds and stars"
      data-paused={halted}
      className={cn("scene-stage pointer-events-none absolute inset-0 overflow-hidden select-none", className)}
      style={{ "--scene-speed": speed, "--box-w": "100vw" } as CSSProperties}
    >
      <div className="absolute inset-0" style={{ zIndex: SCENE_DEPTH.sky }}>
        <Starfield />
      </div>

      <div className="absolute" style={skyStyle}>
        <div className="absolute inset-0" style={{ zIndex: SCENE_DEPTH.sky }}>
          {planets.map((planet) => (
            <SceneImage
              key={planet.asset}
              placement={planet}
              className="scene-loop scene-sway"
              style={loop(planet.asset === "planet-glow" ? 22 : 16, planet.asset === "planet-glow" ? 0 : -6)}
            />
          ))}

          {orbs.map((orb) => (
            <SceneImage
              key={`${orb.asset}-${orb.x}`}
              placement={orb}
              className="scene-loop scene-glimmer"
              style={twinkle(orb)}
            />
          ))}

          {sparkles.map((sparkle) => (
            <SceneImage
              key={`${sparkle.asset}-${sparkle.x}`}
              placement={sparkle}
              className="scene-loop scene-twinkle"
              style={twinkle(sparkle)}
            />
          ))}
        </div>

        <CloudLayer clouds={cloudsFar} depth={SCENE_DEPTH.farClouds} />
        <CloudLayer clouds={cloudsBack} depth={SCENE_DEPTH.backClouds} />

        {streaks.map((streak) => (
          <SceneImage
            key={streak.asset}
            placement={streak}
            className="scene-loop scene-streak will-change-transform"
            style={
              {
                ...loop(streak.duration, streak.delay),
                opacity: 0,
                zIndex: SCENE_DEPTH.streaks,
                "--streak-dx": ofSky(-STREAK_TRAVEL),
                "--streak-dy": ofSky(STREAK_TRAVEL * slope),
              } as CSSProperties
            }
          />
        ))}

        <CloudLayer clouds={cloudsMid} depth={SCENE_DEPTH.midClouds} />
        <CloudLayer clouds={cloudsFront} depth={SCENE_DEPTH.frontClouds} />
      </div>

      <div
        className={cn("absolute aspect-[1672/941]", rigClassName ?? "inset-0")}
        style={{ zIndex: SCENE_DEPTH.rig }}
      >
        <div
          className="scene-loop scene-float absolute inset-0 will-change-transform"
          style={{
            ...loop(5.2),
            transformOrigin: `${toWidth(rigPivot.x)}% ${toHeight(rigPivot.y)}%`,
          }}
        >
          <SceneImage placement={flame} eager className="scene-loop scene-flicker" style={loop(0.46)} />

          <SceneImage placement={cat} eager />
          <SceneImage placement={rocket} eager />
        </div>
      </div>
    </div>
  );
}
