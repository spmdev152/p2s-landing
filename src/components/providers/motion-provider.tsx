"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { duration, easing } from "@/design-system/tokens";

/**
 * Props accepted by {@link MotionProvider}.
 */
export interface MotionProviderProps {
  /** Tree that inherits the shared motion configuration. */
  readonly children: ReactNode;
}

/**
 * Applies the system-wide motion defaults.
 *
 * Setting `reducedMotion` to `"user"` makes every descendant drop transform and
 * layout animations when the operating system requests reduced motion, so
 * individual components never have to branch on the preference themselves.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: duration.base, ease: easing.quick }}
    >
      {children}
    </MotionConfig>
  );
}
