"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Number of times the track content is repeated.
 *
 * Two copies is the minimum required for a seamless `-50%` loop; the third and
 * fourth guarantee the track still overflows on ultra-wide viewports where a
 * single copy would leave a gap.
 */
const TRACK_REPEATS = 4;

/**
 * Props accepted by {@link Marquee}.
 */
export interface MarqueeProps {
  /** One pass of the content. It is repeated internally to build the loop. */
  readonly children: ReactNode;
  /** Seconds for the track to travel one full cycle. Lower is faster. */
  readonly cycleSeconds?: number;
  /** Travel direction. Defaults to `"left"`. */
  readonly direction?: "left" | "right";
  /** Additional classes applied to the clipping container. */
  readonly className?: string;
}

/**
 * An infinitely scrolling horizontal track.
 *
 * The content is duplicated and the track is translated by exactly half its
 * width, so the loop restarts on a frame identical to the one it left and the
 * seam is never visible.
 *
 * Honours the user's reduced motion preference by rendering a single static
 * pass instead of animating.
 */
export function Marquee({
  children,
  cycleSeconds = 26,
  direction = "left",
  className,
}: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const travel = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <div className={cn("relative flex w-full overflow-hidden", className)}>
      <motion.div
        className="flex w-max shrink-0 items-center"
        animate={prefersReducedMotion ? undefined : { x: travel }}
        transition={{ duration: cycleSeconds, ease: "linear", repeat: Infinity }}
      >
        {Array.from({ length: prefersReducedMotion ? 1 : TRACK_REPEATS }, (_unused, copy) => (
          <div key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
