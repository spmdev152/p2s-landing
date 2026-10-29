"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";

import type { NavigationItem } from "@/content/site-navigation";
import { duration, easing } from "@/design-system/tokens";
import { scrollToSection } from "@/lib/scroll-to-section";

/**
 * Props accepted by {@link NavLink}.
 */
export interface NavLinkProps {
  /** The navigation entry to render. */
  readonly item: NavigationItem;
}

const labelVariants: Variants = {
  rest: { y: "0%" },
  hover: { y: "-100%" },
};

/**
 * The understudy is anchored at `top: 100%`, so it already sits exactly one line
 * below the mask at rest and both labels can share a single travel distance.
 * Anchoring it there rather than offsetting it with a transform keeps the two
 * copies in lockstep no matter how the line height changes.
 */
const understudyVariants: Variants = {
  rest: { y: "0%" },
  hover: { y: "-100%" },
};

const indexVariants: Variants = {
  rest: { opacity: 0, y: 3 },
  hover: { opacity: 1, y: 0 },
};

const transition = { duration: duration.base, ease: easing.snap };

/**
 * A desktop navigation link whose label is replaced by a tinted duplicate on
 * hover.
 *
 * Both copies of the label are always present in the DOM; only the visible one
 * is exposed to assistive technology so the accessible name stays singular.
 */
export function NavLink({ item }: NavLinkProps) {
  return (
    <motion.div initial="rest" animate="rest" whileHover="hover" whileFocus="hover">
      <Link
        href={item.href}
        onClick={scrollToSection}
        className="flex items-baseline gap-1.5 font-sans text-nav font-medium uppercase"
      >
        <motion.span
          aria-hidden
          variants={indexVariants}
          transition={transition}
          className="font-mono text-[0.5625rem] text-volt"
        >
          {item.index}
        </motion.span>
        <span className="relative block overflow-hidden">
          <motion.span variants={labelVariants} transition={transition} className="block text-chalk">
            {item.label}
          </motion.span>
          <motion.span
            aria-hidden
            variants={understudyVariants}
            transition={transition}
            className="absolute inset-x-0 top-full block text-volt"
          >
            {item.label}
          </motion.span>
        </span>
      </Link>
    </motion.div>
  );
}
