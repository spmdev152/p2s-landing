"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import type { Project } from "@/content/projects";
import { duration, easing } from "@/design-system/tokens";

import { CaseFilePlate } from "./case-file-plate";

/**
 * Animatable Next.js link, so the element that owns the hover and focus states
 * is the same element the user actually activates.
 */
const MotionLink = motion.create(Link);

/**
 * Props accepted by {@link CaseFileCard}.
 */
export interface CaseFileCardProps {
  /** The project to render. */
  readonly project: Project;
  /** Zero-based position in the deck. Drives both the stack offset and depth. */
  readonly position: number;
  /** Label of the card's call to action. */
  readonly actionLabel: string;
}

/**
 * The plane that floods the card's header strip from its leading edge.
 *
 * Scaling from a left origin rather than sliding a full width block keeps the
 * animation on the compositor whatever the card is asked to be.
 */
const stripFloodVariants: Variants = {
  rest: { scaleX: 0 },
  active: { scaleX: 1 },
};

const headingVariants: Variants = {
  rest: { x: 0 },
  active: { x: 12 },
};

const ruleVariants: Variants = {
  rest: { scaleX: 0 },
  active: { scaleX: 1 },
};

const actionVariants: Variants = {
  rest: { x: 0 },
  active: { x: 8 },
};

const arrowVariants: Variants = {
  rest: { x: 0, y: 0 },
  active: { x: 5, y: -5 },
};

const floodTransition = { duration: duration.base, ease: easing.snap };
const contentTransition = { duration: duration.quick, ease: easing.quick };

const entranceVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

/**
 * One case file in the deck.
 *
 * The card is pinned by `position: sticky` at an offset one header strip lower
 * than the card before it, so scrolling stacks the strips into a legible index
 * of everything already read — a drawer of files rather than a carousel. The
 * card body is opaque by necessity: it has to hide the card underneath it
 * completely, or the stack reads as transparency instead of depth.
 *
 * Every reveal is a variant on the link itself, so tabbing to a card produces
 * exactly the same result as hovering it.
 */
export function CaseFileCard({ project, position, actionLabel }: CaseFileCardProps) {
  return (
    <motion.li
      variants={entranceVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: duration.slow, ease: easing.snap }}
      style={{
        top: `calc(var(--deck-top) + ${position} * var(--deck-strip))`,
        zIndex: position + 1,
      }}
    >
      <MotionLink
        href={project.href}
        initial="rest"
        animate="rest"
        whileHover="active"
        whileFocus="active"
        className="group block border-2 border-chalk/14 bg-void transition-colors duration-300 hover:border-volt focus-visible:border-volt"
      >
        <div className="relative isolate flex h-[var(--deck-strip)] items-center justify-between gap-4 overflow-hidden border-b-2 border-chalk/14 bg-carbon px-4 lg:px-6">
          <motion.span
            aria-hidden
            variants={stripFloodVariants}
            transition={floodTransition}
            className="absolute inset-0 -z-10 origin-left bg-pulse"
          />

          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-eyebrow text-volt">{project.index}</span>
            <span aria-hidden className="h-3 w-0.5 shrink-0 bg-chalk/25" />
            <span className="truncate font-mono text-eyebrow text-chalk uppercase">
              {project.name}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-mono text-eyebrow text-ash uppercase transition-colors duration-300 group-hover:text-pulse-pale group-focus-visible:text-pulse-pale sm:inline">
              {project.discipline}
            </span>
            <span className="font-mono text-eyebrow text-ash transition-colors duration-300 group-hover:text-pulse-pale group-focus-visible:text-pulse-pale">
              {project.year}
            </span>
          </div>
        </div>

        <div className="grid gap-8 p-5 sm:p-7 lg:min-h-88 lg:grid-cols-12 lg:gap-10 lg:p-10">
          <div className="order-first h-40 sm:h-48 lg:order-none lg:col-span-5 lg:h-auto">
            <CaseFilePlate seed={project.id} numeral={project.index} />
          </div>

          <div className="flex flex-col justify-between gap-8 lg:col-span-7 lg:gap-10">
            <div className="flex flex-col gap-5 lg:gap-6">
              <motion.h3
                variants={headingVariants}
                transition={floodTransition}
                className="font-display text-display text-chalk uppercase"
              >
                {project.name}
              </motion.h3>

              <div aria-hidden className="relative h-0.5 w-full max-w-64 bg-chalk/14">
                <motion.span
                  variants={ruleVariants}
                  transition={floodTransition}
                  className="absolute inset-0 origin-left bg-volt"
                />
              </div>

              <p className="max-w-xl text-lede text-ash">{project.summary}</p>

              <ul className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border-2 border-chalk/15 px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.1em] text-ash uppercase"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-8 border-t-2 border-chalk/14 pt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
              {project.metrics === undefined ? null : (
                <ul className="flex flex-wrap gap-x-8 gap-y-5 lg:gap-x-12">
                  {project.metrics.map((metric) => (
                    <li key={metric.id} className="flex flex-col gap-1.5">
                      <span className="font-display text-2xl text-volt lg:text-3xl">
                        {metric.value}
                      </span>
                      <span className="font-mono text-[0.625rem] tracking-[0.12em] text-ash uppercase">
                        {metric.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <motion.span
                variants={actionVariants}
                transition={contentTransition}
                className="flex shrink-0 items-center gap-2 font-mono text-eyebrow text-volt uppercase"
              >
                {actionLabel}
                <motion.span variants={arrowVariants} transition={contentTransition}>
                  <ArrowUpRight className="size-3.5" />
                </motion.span>
              </motion.span>
            </div>
          </div>
        </div>
      </MotionLink>
    </motion.li>
  );
}
