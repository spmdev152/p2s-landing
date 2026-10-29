"use client";

import { motion, type Variants } from "motion/react";

import type { ApproachPrinciple } from "@/content/approach-content";
import { duration, easing } from "@/design-system/tokens";

/**
 * Props accepted by {@link PrincipleCard}.
 */
export interface PrincipleCardProps {
  /** The principle to render. */
  readonly principle: ApproachPrinciple;
  /** Heading of the list of commitments. */
  readonly commitmentsTitle: string;
}

/**
 * The card is two planes, like every control in the system: an opaque face
 * and a pulse block peeking out from behind it. On hover the two part as if
 * the card were lifting off the page.
 */
const planeVariants: Variants = {
  rest: { x: 6, y: 6 },
  lifted: { x: 10, y: 10 },
};

const faceVariants: Variants = {
  rest: { x: 0, y: 0 },
  lifted: { x: -2, y: -2 },
};

/** The volt rule under the title runs the full measure once the card lifts. */
const ruleVariants: Variants = {
  rest: { scaleX: 0.18 },
  lifted: { scaleX: 1 },
};

const liftTransition = { duration: duration.base, ease: easing.snap };

/**
 * Delay before the readout starts printing once the card is in view, and the
 * gap between its lines, in seconds. The lines print after the card has risen
 * into place, one at a time, like a command reporting back.
 */
const READOUT_DELAY = 0.35;
const READOUT_STAGGER = 0.12;

/**
 * One principle of the approach: a header strip naming it, the principle as a
 * headline, what it means, the commitments that follow from it, and a readout
 * printed like the output of a command, which turns each promise into
 * something that sounds checkable.
 *
 * The readout is pinned to the bottom of the card, so cards side by side end
 * on the same line however long their copy runs.
 */
export function PrincipleCard({ principle, commitmentsTitle }: PrincipleCardProps) {
  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover="lifted"
      aria-labelledby={`principle-${principle.id}`}
      className="group relative h-full"
    >
      <motion.span
        aria-hidden
        variants={planeVariants}
        transition={liftTransition}
        className="absolute inset-0 bg-pulse"
      />

      <motion.div
        variants={faceVariants}
        transition={liftTransition}
        className="relative flex h-full flex-col border-2 border-chalk/14 bg-void transition-colors duration-300 group-hover:border-volt"
      >
        <header className="flex h-14 items-center justify-between gap-4 border-b-2 border-chalk/14 bg-carbon px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-mono text-eyebrow text-volt">{principle.index}</span>
            <span aria-hidden className="h-3 w-0.5 shrink-0 bg-chalk/25" />
            <span className="truncate font-mono text-eyebrow text-chalk uppercase">{principle.kicker}</span>
          </div>
          <span aria-hidden className="size-2 shrink-0 bg-volt" />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-5 sm:p-7 lg:p-6 xl:p-8">
          <div className="flex flex-col gap-5">
            <h3
              id={`principle-${principle.id}`}
              className="font-display text-[2rem] leading-[0.95] text-chalk uppercase xl:text-[2.5rem]"
            >
              {principle.title}
            </h3>

            <div aria-hidden className="relative h-0.5 w-full bg-chalk/14">
              <motion.span
                variants={ruleVariants}
                transition={liftTransition}
                className="absolute inset-0 origin-left bg-volt"
              />
            </div>

            <p className="text-[0.9375rem] leading-relaxed text-ash">{principle.summary}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-eyebrow text-ash/70 uppercase">{commitmentsTitle}</h4>
            <ul className="flex flex-col gap-3">
              {principle.commitments.map((commitment) => (
                <li key={commitment} className="flex items-start gap-3 text-sm leading-snug text-chalk/85">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 bg-volt" />
                  {commitment}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto border-t-2 border-chalk/14 bg-carbon/70 px-5 py-5 font-mono text-eyebrow uppercase sm:px-7 lg:px-6 xl:px-8">
          <p className="flex items-center gap-2 text-ash normal-case">
            <span className="text-volt">$</span>
            {principle.readoutCommand}
            <span aria-hidden className="h-3 w-1.5 animate-pulse bg-volt" />
          </p>

          <ul className="mt-4 flex flex-col gap-2.5">
            {principle.readout.map((line, position) => (
              <motion.li
                key={line.id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 1 }}
                transition={{
                  duration: duration.quick,
                  ease: easing.quick,
                  delay: READOUT_DELAY + position * READOUT_STAGGER,
                }}
                className="flex items-end gap-2"
              >
                <span className="text-chalk/80">{line.label}</span>
                <span aria-hidden className="mb-0.5 flex-1 border-b-2 border-dotted border-chalk/15" />
                <span className="text-volt">{line.value}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.article>
  );
}
