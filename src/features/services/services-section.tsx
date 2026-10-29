"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { MicroTag } from "@/components/ui/micro-tag";
import { OffsetButton } from "@/components/ui/offset-button";
import type { Capability } from "@/content/capabilities";
import type { ServicesContent } from "@/content/services-content";
import { duration, easing } from "@/design-system/tokens";

import { ServiceRow } from "./service-row";

/**
 * Props accepted by {@link ServicesSection}.
 */
export interface ServicesSectionProps {
  /** Copy for the section frame. */
  readonly content: ServicesContent;
  /** Disciplines rendered as the index. */
  readonly capabilities: readonly Capability[];
}

/**
 * Scroll range over which the parallax layers travel.
 *
 * `start end` is the moment the section's top edge meets the bottom of the
 * viewport, `end start` the moment its bottom edge leaves the top, so the whole
 * traversal is mapped rather than just the part that is on screen.
 */
const PARALLAX_RANGE = ["start end", "end start"] as const;

/**
 * Horizontal travel of the two heading lines as the section scrolls.
 *
 * Absolute units, not percentages. Motion resolves a percentage against the
 * animated element's own width, and these lines are block level inside a full
 * width heading — so a nominal "5%" becomes a shove of forty-odd pixels that
 * pushes the line straight through the shell's 1.25rem gutter and off the page,
 * where `overflow-x: hidden` silently clips its first glyph. Any value here must
 * stay below that gutter, which is the narrowest the shell ever gets.
 */
const HEADING_DRIFT = {
  first: ["-0.9rem", "0.9rem"],
  second: ["1rem", "-1rem"],
} as const;

const rowEntranceVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

/**
 * The services index.
 *
 * Three layers move independently as the section scrolls: an oversized outlined
 * numeral drifting upward behind everything, and the two heading lines drifting
 * horizontally against each other. The effect is subtle by design — it should
 * register as the page breathing, not as a carousel.
 */
export function ServicesSection({ content, capabilities }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [...PARALLAX_RANGE],
  });

  const numeralDrift = useTransform(scrollYProgress, [0, 1], ["14%", "-20%"]);
  const firstLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.first]);
  const secondLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.second]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative isolate overflow-hidden py-24 lg:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.span
          style={{ y: numeralDrift }}
          className="text-outline absolute -right-8 -bottom-16 font-display text-[22rem] leading-none opacity-25 select-none lg:text-[34rem]"
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

        <ul className="mt-16 border-t-2 border-chalk/12 lg:mt-24">
          {capabilities.map((capability, index) => (
            <motion.li
              key={capability.id}
              variants={rowEntranceVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: duration.slow,
                ease: easing.snap,
                delay: index * 0.06,
              }}
            >
              <ServiceRow capability={capability} />
            </motion.li>
          ))}
        </ul>

        <div className="shell mt-16 flex flex-col gap-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5">
            <div className="hazard-hatch h-1.5 w-24" />
            <p className="max-w-xl text-lede text-ash">{content.closingPrompt}</p>
          </div>

          <OffsetButton href={content.closingActionHref} className="self-start lg:self-auto">
            {content.closingActionLabel}
            <ArrowUpRight />
          </OffsetButton>
        </div>
      </div>
    </section>
  );
}
