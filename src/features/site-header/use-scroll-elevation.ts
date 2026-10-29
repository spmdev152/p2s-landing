"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

/**
 * Reports whether the page has been scrolled past a threshold.
 *
 * Reads from Motion's scroll value rather than a React state driven listener, so
 * the check runs inside the animation frame loop and never triggers a render
 * unless the boolean result actually changes.
 *
 * @param threshold - Scroll offset, in pixels, at which the header becomes
 * elevated.
 * @returns `true` once the page is scrolled beyond `threshold`.
 */
export function useScrollElevation(threshold = 24): boolean {
  const { scrollY } = useScroll();
  const [isElevated, setIsElevated] = useState(false);

  useMotionValueEvent(scrollY, "change", (offset) => {
    setIsElevated(offset > threshold);
  });

  return isElevated;
}
