"use client";

import { motion, useReducedMotion, useSpring, type Variants } from "motion/react";
import { useEffect } from "react";

import { duration, easing } from "@/design-system/tokens";
import { useFinePointer } from "@/hooks/use-fine-pointer";

import { useCursorState } from "./use-cursor-state";

/**
 * Class applied to the document element while the custom cursor is mounted.
 * Suppressing the native cursor is scoped to that class so touch and keyboard
 * users, who never mount this component, keep their system cursor untouched.
 */
const SUPPRESSION_CLASS = "has-custom-cursor";

/**
 * Follow spring for the ring. Tuned to trail the pointer by a perceptible but
 * small amount — enough to read as a physical object, not enough to feel laggy.
 */
const FOLLOW_SPRING = { stiffness: 620, damping: 46, mass: 0.55 };

const shapeTransition = { duration: duration.quick, ease: easing.snap };

/**
 * Ring states.
 *
 * Every variant declares the same keys. Motion does not reset properties a
 * variant omits, so a variant that set `scaleX` and a later one that only set
 * `scale` would compound into a permanently squashed ring.
 */
const ringVariants: Variants = {
  default: {
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  action: {
    scaleX: 1.45,
    scaleY: 1.45,
    rotate: 45,
    borderWidth: 3,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  text: {
    scaleX: 0.06,
    scaleY: 1.2,
    rotate: 0,
    borderWidth: 0,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  pressed: {
    scaleX: 0.72,
    scaleY: 0.72,
    rotate: 45,
    borderWidth: 4,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
};

/**
 * Core states. The core marks the exact pointer position, so it never lags and
 * never moves off centre — it only changes weight.
 */
const coreVariants: Variants = {
  default: { scaleX: 1, scaleY: 1, opacity: 1 },
  action: { scaleX: 0.7, scaleY: 0.7, opacity: 1 },
  text: { scaleX: 1, scaleY: 1, opacity: 0 },
  pressed: { scaleX: 1.9, scaleY: 1.9, opacity: 1 },
};

function CursorLayer() {
  const { mode, isPressed, isVisible, x, y } = useCursorState();
  const prefersReducedMotion = useReducedMotion();

  const springX = useSpring(x, FOLLOW_SPRING);
  const springY = useSpring(y, FOLLOW_SPRING);

  const ringX = prefersReducedMotion ? x : springX;
  const ringY = prefersReducedMotion ? y : springY;

  const variant = isPressed ? "pressed" : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(SUPPRESSION_CLASS);

    return () => {
      root.classList.remove(SUPPRESSION_CLASS);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-100 mix-blend-difference">
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: duration.instant }}
        className="absolute top-0 left-0"
      >
        <motion.div
          variants={ringVariants}
          animate={variant}
          transition={shapeTransition}
          className="-mt-5 -ml-5 size-10 border-chalk will-change-transform"
        />
      </motion.div>

      <motion.div
        style={{ x, y }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: duration.instant }}
        className="absolute top-0 left-0"
      >
        <motion.div
          variants={coreVariants}
          animate={variant}
          transition={shapeTransition}
          className="-mt-1 -ml-1 size-2 bg-chalk will-change-transform"
        />
      </motion.div>
    </div>
  );
}

/**
 * A custom pointer built from two hard-edged planes.
 *
 * A core square marks the exact position, and a ring trails it on a spring. The
 * ring reads its surroundings and changes shape accordingly: it opens into a
 * rotated diamond over anything activatable, and collapses into a solid caret
 * bar over prose — two visibly different transformations rather than one shape
 * resized.
 *
 * The whole layer is composited with `difference`, so it inverts whatever is
 * beneath it. That is what keeps it legible over the volt planes that flood the
 * services rows, where a fixed colour would disappear, and it happens to
 * resolve to palette hues over every surface in the system.
 *
 * Mounts only for fine pointers, so touch devices are unaffected and the native
 * cursor is never suppressed for them.
 */
export function CustomCursor() {
  const isFinePointer = useFinePointer();

  if (!isFinePointer) {
    return null;
  }

  return <CursorLayer />;
}
