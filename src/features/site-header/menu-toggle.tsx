"use client";

import { motion, type Variants } from "motion/react";

import { duration, easing } from "@/design-system/tokens";
import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link MenuToggle}.
 */
export interface MenuToggleProps {
  /** Whether the navigation panel is currently open. */
  readonly isOpen: boolean;
  /** Invoked when the control is activated. */
  readonly onToggle: () => void;
  /** Identifier of the panel this control governs. */
  readonly controls: string;
  /** Additional classes applied to the button. */
  readonly className?: string;
}

const topBarVariants: Variants = {
  closed: { rotate: 0, y: -4 },
  open: { rotate: 45, y: 0 },
};

const bottomBarVariants: Variants = {
  closed: { rotate: 0, y: 4 },
  open: { rotate: -45, y: 0 },
};

const transition = { duration: duration.base, ease: easing.snap };

/**
 * Square bordered control that folds two rules into a cross when the mobile
 * navigation panel opens.
 */
export function MenuToggle({ isOpen, onToggle, controls, className }: MenuToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={controls}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      animate={isOpen ? "open" : "closed"}
      initial={false}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative flex size-11 items-center justify-center rounded-brutal border-2 border-pulse-soft/60 bg-void",
        className,
      )}
    >
      <span aria-hidden className="relative block h-4 w-5">
        <motion.span
          variants={topBarVariants}
          transition={transition}
          className="absolute top-[calc(50%-1px)] left-0 block h-0.5 w-full bg-volt"
        />
        <motion.span
          variants={bottomBarVariants}
          transition={transition}
          className="absolute top-[calc(50%-1px)] left-0 block h-0.5 w-full bg-volt"
        />
      </span>
    </motion.button>
  );
}
