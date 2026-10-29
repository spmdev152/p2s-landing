"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import type { Capability } from "@/content/capabilities";
import { duration, easing } from "@/design-system/tokens";

/**
 * Animatable Next.js link, so the element that owns the hover and focus states
 * is the same element the user actually activates.
 */
const MotionLink = motion.create(Link);

/**
 * Props accepted by {@link ServiceRow}.
 */
export interface ServiceRowProps {
  /** The discipline to render. */
  readonly capability: Capability;
}

/**
 * The volt plane that floods the row from its leading edge.
 *
 * Scaling from a left origin rather than sliding a full width block keeps the
 * animation on the compositor and costs no layout work, however wide the
 * viewport is.
 */
const floodVariants: Variants = {
  rest: { scaleX: 0 },
  active: { scaleX: 1 },
};

const labelVariants: Variants = {
  rest: { x: 0 },
  active: { x: 18 },
};

/**
 * Tags and summary occupy the same cell and trade places, so the row never
 * changes height and never shifts the content below it mid-interaction.
 */
const tagsVariants: Variants = {
  rest: { opacity: 1, y: 0 },
  active: { opacity: 0, y: -10 },
};

const summaryVariants: Variants = {
  rest: { opacity: 0, y: 10 },
  active: { opacity: 1, y: 0 },
};

const arrowVariants: Variants = {
  rest: { x: 0, y: 0 },
  active: { x: 6, y: -6 },
};

const floodTransition = { duration: duration.base, ease: easing.snap };
const contentTransition = { duration: duration.quick, ease: easing.quick };

/**
 * A single discipline in the services index.
 *
 * On pointer hover or keyboard focus the row inverts: a volt plane wipes across
 * it, the label steps aside, and the deliverable chips give way to the summary.
 * Because both states are driven by variants on the link itself, keyboard users
 * get exactly the same reveal as pointer users.
 *
 * Below the large breakpoint the summary is always visible and the chips are
 * removed, since a touch device never produces a hover state and the copy would
 * otherwise be unreachable.
 */
export function ServiceRow({ capability }: ServiceRowProps) {
  return (
    <MotionLink
      href={capability.href}
      initial="rest"
      animate="rest"
      whileHover="active"
      whileFocus="active"
      className="group relative block border-b-2 border-chalk/12"
    >
      <motion.span
        aria-hidden
        variants={floodVariants}
        transition={floodTransition}
        className="absolute inset-0 origin-left bg-volt"
      />

      <div className="shell relative py-8 lg:py-0">
        <div className="flex flex-col gap-4 lg:grid lg:min-h-34 lg:grid-cols-[4rem_minmax(0,1fr)_16rem_2.5rem] lg:items-center lg:gap-x-8 lg:gap-y-0 xl:grid-cols-[4.5rem_minmax(0,1fr)_22rem_2.5rem]">
          <div className="flex items-center justify-between lg:block">
            <span className="inline-flex size-9 items-center justify-center border-2 border-volt/40 font-mono text-[0.6875rem] text-volt transition-colors delay-100 duration-200 group-hover:border-void group-hover:bg-void group-focus-visible:border-void group-focus-visible:bg-void">
              {capability.index}
            </span>
            <ArrowUpRight className="size-5 text-volt lg:hidden" />
          </div>

          <motion.h3
            variants={labelVariants}
            transition={floodTransition}
            className="font-display text-display text-chalk uppercase transition-colors delay-100 duration-200 group-hover:text-void group-focus-visible:text-void"
          >
            {capability.label}
          </motion.h3>

          <p className="max-w-md text-sm leading-relaxed text-ash lg:hidden">
            {capability.summary}
          </p>

          <div className="relative hidden lg:block lg:h-16">
            <motion.ul
              aria-hidden
              variants={tagsVariants}
              transition={contentTransition}
              className="absolute inset-0 flex flex-wrap content-center gap-2"
            >
              {capability.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-2 border-chalk/15 px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.1em] text-ash uppercase"
                >
                  {tag}
                </li>
              ))}
            </motion.ul>

            <motion.p
              variants={summaryVariants}
              transition={contentTransition}
              className="absolute inset-0 flex items-center text-sm leading-relaxed text-void"
            >
              {capability.summary}
            </motion.p>
          </div>

          <motion.span
            aria-hidden
            variants={arrowVariants}
            transition={floodTransition}
            className="hidden justify-end text-volt transition-colors delay-100 duration-200 group-hover:text-void group-focus-visible:text-void lg:flex"
          >
            <ArrowUpRight className="size-7" />
          </motion.span>
        </div>
      </div>
    </MotionLink>
  );
}
