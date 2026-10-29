import Image from "next/image";
import type { CSSProperties } from "react";

import manifest from "@/content/scene-manifest.json";
import { cn } from "@/lib/cn";

import { STAGE, type Placement } from "./scene-layout";

/**
 * Props accepted by {@link SceneImage}.
 */
export interface SceneImageProps {
  /** Where and how large the image sits on the stage. */
  readonly placement: Placement;
  /** Classes for the positioned box, usually an animation. */
  readonly className?: string;
  /** Extra inline styles for the positioned box, usually animation variables. */
  readonly style?: CSSProperties;
  /** Fetch ahead of the rest of the scene. Reserved for the rig. */
  readonly eager?: boolean;
}

/**
 * Converts a stage measurement to a percentage of the stage's width.
 *
 * @param value - Stage pixels.
 */
export function toWidth(value: number): number {
  return (value / STAGE.width) * 100;
}

/**
 * Converts a stage measurement to a percentage of the stage's height.
 *
 * @param value - Stage pixels.
 */
export function toHeight(value: number): number {
  return (value / STAGE.height) * 100;
}

/**
 * One piece of artwork, positioned on the stage in percentages so the scene
 * scales as a whole. The box carries the aspect ratio from the manifest, so
 * nothing shifts while images load, and `sizes` tells the optimiser how wide
 * the piece is relative to the viewport so it never ships more pixels than the
 * stage can show.
 *
 * Every piece loads eagerly. The scene is seen whole or not at all, and lazy
 * loading misjudges pieces that start their loop translated off the stage,
 * which left clouds blank for their first pass.
 */
export function SceneImage({ placement, className, style, eager = false }: SceneImageProps) {
  const { asset, x, y, w, rotate, origin, opacity } = placement;
  const source = manifest[asset];
  const widthShare = toWidth(w);

  return (
    <div
      aria-hidden
      className={cn("absolute", className)}
      style={{
        left: `${toWidth(x)}%`,
        top: `${toHeight(y)}%`,
        width: `${widthShare}%`,
        aspectRatio: `${source.width} / ${source.height}`,
        rotate: rotate === undefined ? undefined : `${rotate}deg`,
        transformOrigin: origin === undefined ? undefined : `${origin[0] * 100}% ${origin[1] * 100}%`,
        opacity,
        ...style,
      }}
    >
      <Image
        src={source.src}
        alt=""
        fill
        draggable={false}
        sizes={`${Math.ceil(widthShare)}vw`}
        loading="eager"
        fetchPriority={eager ? "high" : "auto"}
        className="pointer-events-none object-contain select-none"
      />
    </div>
  );
}
