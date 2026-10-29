"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { MicroTag } from "@/components/ui/micro-tag";
import { OffsetButton } from "@/components/ui/offset-button";
import type { ApproachContent } from "@/content/approach-content";
import { duration, easing } from "@/design-system/tokens";

import { PrincipleCard } from "./principle-card";

/**
 * Props accepted by {@link ApproachSection}.
 */
export interface ApproachSectionProps {
  /** Copy for the section frame and its principles. */
  readonly content: ApproachContent;
}

/**
 * Scroll range over which the section's parallax layers travel.
 *
 * `start end` is the moment the section's top edge meets the bottom of the
 * viewport, `end start` the moment its bottom edge leaves the top.
 */
const PARALLAX_RANGE = ["start end", "end start"] as const;

/**
 * Travel of the outlined section numeral, as a fraction of its own height.
 *
 * Anchored to the top right corner of a clipped layer, so like the work
 * section's numeral it only travels downward: an upward term would shave its
 * cap heights against the top edge.
 */
const NUMERAL_DRIFT = ["0%", "24%"] as const;

/**
 * Horizontal travel of the two heading lines.
 *
 * Absolute units, bounded by the shell's narrowest gutter. See
 * `services-section.tsx` for what a percentage does here.
 */
const HEADING_DRIFT = {
  first: ["0.9rem", "-0.9rem"],
  second: ["-1rem", "0.8rem"],
} as const;

const cardEntranceVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

/** Seconds between the cards' entrances, left to right. */
const CARD_STAGGER = 0.1;

/**
 * The approach section: three rules p2s works by, one card each, and a closing
 * line that puts them in writing.
 *
 * The frame follows every other section: an outlined numeral drifting behind
 * everything, two heading lines drifting against each other, and the lede on
 * the heading's baseline. The cards sit three abreast from `lg` and stack
 * below it; they rise into place one after another, and each card's readout
 * then prints line by line.
 */
export function ApproachSection({ content }: ApproachSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [...PARALLAX_RANGE],
  });

  const numeralDrift = useTransform(scrollYProgress, [0, 1], [...NUMERAL_DRIFT]);
  const firstLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.first]);
  const secondLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.second]);

  return (
    <section ref={sectionRef} id="approach" className="relative isolate py-24 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.span
          style={{ y: numeralDrift }}
          className="text-outline absolute top-0 -right-10 font-display text-[22rem] leading-none opacity-20 select-none lg:text-[34rem]"
        >
          {content.numeral}
        </motion.span>
      </div>

      <div className="relative">
        <header className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <MicroTag className="border-volt/40 text-volt">{content.eyebrow}</MicroTag>

            <h2 className="mt-8 font-display text-section text-chalk uppercase">
              <motion.span style={{ x: firstLineDrift }} className="block will-change-transform">
                {content.headingLines[0]}
              </motion.span>
              <motion.span
                style={{ x: secondLineDrift }}
                className="block text-volt will-change-transform"
              >
                {content.headingLines[1]}
              </motion.span>
            </h2>
          </div>

          <div className="flex items-end lg:col-span-5">
            <p className="max-w-md text-lede text-ash">{content.lede}</p>
          </div>
        </header>

        <ul
          aria-label={content.principlesLabel}
          className="shell mt-16 grid gap-10 lg:mt-24 lg:grid-cols-3 lg:gap-8"
        >
          {content.principles.map((principle, position) => (
            <motion.li
              key={principle.id}
              variants={cardEntranceVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: duration.slow,
                ease: easing.snap,
                delay: position * CARD_STAGGER,
              }}
              className="pr-2.5 pb-2.5"
            >
              <PrincipleCard principle={principle} commitmentsTitle={content.commitmentsTitle} />
            </motion.li>
          ))}
        </ul>

        <div className="shell mt-16 flex flex-col gap-8 lg:mt-24 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5">
            <div className="hazard-hatch h-1.5 w-24" />
            <p className="max-w-xl text-lede text-ash">{content.closingPrompt}</p>
          </div>

          <OffsetButton
            href={content.closingActionHref}
            tone="pulse"
            className="self-start lg:self-auto"
          >
            {content.closingActionLabel}
            <ArrowUpRight />
          </OffsetButton>
        </div>
      </div>
    </section>
  );
}
