"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { MicroTag } from "@/components/ui/micro-tag";
import type { TeamContent } from "@/content/team-content";
import { duration, easing } from "@/design-system/tokens";

import { FounderCard } from "./founder-card";

/**
 * Props accepted by {@link TeamSection}.
 */
export interface TeamSectionProps {
  /** Copy for the section frame and the people in it. */
  readonly content: TeamContent;
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
 * Anchored to the lower left corner, so like the contact section's numeral it
 * bleeds off two edges at once and may travel both ways.
 */
const NUMERAL_DRIFT = ["12%", "-16%"] as const;

/**
 * Horizontal travel of the two heading lines.
 *
 * Absolute units, bounded by the shell's narrowest gutter. See
 * `services-section.tsx` for what a percentage does here.
 */
const HEADING_DRIFT = {
  first: ["-1rem", "0.9rem"],
  second: ["0.8rem", "-1rem"],
} as const;

const cardEntranceVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

/** Seconds between the two portraits' entrances. */
const CARD_STAGGER = 0.12;

/**
 * The team section: the two founders, side by side.
 *
 * The frame follows every other section: an outlined numeral drifting behind
 * everything, two heading lines drifting against each other, and the lede on
 * the heading's baseline. Each portrait sits under the brand gradient until it
 * is hovered, or, on touch screens, until it is on screen.
 */
export function TeamSection({ content }: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [...PARALLAX_RANGE],
  });

  const numeralDrift = useTransform(scrollYProgress, [0, 1], [...NUMERAL_DRIFT]);
  const firstLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.first]);
  const secondLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.second]);

  return (
    <section ref={sectionRef} id="team" className="relative isolate py-24 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.span
          style={{ y: numeralDrift }}
          className="text-outline absolute -bottom-12 -left-10 font-display text-[22rem] leading-none opacity-20 select-none [--outline-color:var(--color-volt)] lg:text-[34rem]"
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
          aria-label={content.membersLabel}
          className="shell mt-16 grid gap-16 md:grid-cols-2 md:gap-8 lg:mt-24 lg:gap-x-12"
        >
          {content.members.map((member, position) => (
            <motion.li
              key={member.id}
              variants={cardEntranceVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: duration.slow,
                ease: easing.snap,
                delay: position * CARD_STAGGER,
              }}
            >
              <FounderCard member={member} portraitLabel={content.portraitLabel} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
