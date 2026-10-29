"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { MicroTag } from "@/components/ui/micro-tag";
import { OffsetButton } from "@/components/ui/offset-button";
import type { Project } from "@/content/projects";
import type { WorkContent } from "@/content/work-content";
import { clamp } from "@/lib/math";

import { CaseFileCard } from "./case-file-card";
import { DeckRail } from "./deck-rail";
import { useDeckStacking } from "./use-deck-stacking";

/**
 * Props accepted by {@link WorkSection}.
 */
export interface WorkSectionProps {
  /** Copy for the section frame. */
  readonly content: WorkContent;
  /** Case files rendered as the deck. */
  readonly projects: readonly Project[];
}

/**
 * Scroll range over which the section's parallax layers travel.
 *
 * `start end` is the moment the section's top edge meets the bottom of the
 * viewport, `end start` the moment its bottom edge leaves the top.
 */
const PARALLAX_RANGE = ["start end", "end start"] as const;

/**
 * Scroll range of the deck itself, measured from the moment its first card can
 * pin to the moment its last one is released.
 */
const DECK_RANGE = ["start start", "end end"] as const;

/**
 * Travel of the outlined section numeral, as a fraction of its own height.
 *
 * The range is one-directional and starts at zero because the numeral is
 * anchored to the top edge of a clipped layer: a negative term would shave its
 * cap heights against that edge, which reads as a rendering fault rather than as
 * a deliberate bleed. It bleeds off the left edge instead, where a vertical crop
 * against a vertical edge is unambiguous.
 */
const NUMERAL_DRIFT = ["0%", "26%"] as const;

/**
 * Horizontal travel of the two heading lines, mirrored against the services
 * index so the two sections do not drift in lockstep.
 *
 * Absolute units for the reason set out in `services-section.tsx`: a percentage
 * resolves against the animated element's own width, which for a block level
 * heading line is the whole measure, and the resulting travel clears the shell's
 * 1.25rem gutter and gets clipped off the left edge of the page.
 */
const HEADING_DRIFT = {
  first: ["1rem", "-1rem"],
  second: ["-1rem", "1rem"],
} as const;

/**
 * The work section.
 *
 * Case files are dealt rather than listed: each card pins one header strip
 * lower than the one before it, so by the end of the section the strips have
 * stacked into an index of everything already read. The deck only behaves this
 * way where the viewport can hold a whole card — see the `.case-deck` rules in
 * the component layer — and falls back to a plain vertical stack everywhere
 * else, which is the same content in the same order with none of the pinning.
 *
 * The rail's active marker is a proportional read of the deck's scroll, not a
 * record of which card has pinned. Deliberately so: the deepest card settles
 * only as the deck begins to lift, so a mapping keyed to pin events would leave
 * the last marker dark for the entire section.
 */
export function WorkSection({ content, projects }: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isStacked = useDeckStacking(deckRef);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: [...PARALLAX_RANGE],
  });

  const { scrollYProgress: deckProgress } = useScroll({
    target: deckRef,
    offset: [...DECK_RANGE],
  });

  const numeralDrift = useTransform(sectionProgress, [0, 1], [...NUMERAL_DRIFT]);
  const firstLineDrift = useTransform(sectionProgress, [0, 1], [...HEADING_DRIFT.first]);
  const secondLineDrift = useTransform(sectionProgress, [0, 1], [...HEADING_DRIFT.second]);

  useMotionValueEvent(deckProgress, "change", (value) => {
    setActiveIndex((current) => {
      const next = clamp(Math.floor(value * projects.length), 0, projects.length - 1);

      return next === current ? current : next;
    });
  });

  return (
    <section ref={sectionRef} id="work" className="relative isolate py-24 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.span
          style={{ y: numeralDrift }}
          className="text-outline absolute top-0 -left-10 font-display text-[22rem] leading-none opacity-20 select-none [--outline-color:var(--color-volt)] lg:text-[34rem]"
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

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-5 z-30 hidden 2xl:block">
            <div className="sticky top-[45svh]">
              <DeckRail
                markers={projects.map((project) => project.index)}
                activeIndex={activeIndex}
                label={content.railLabel}
              />
            </div>
          </div>

          <ul
            ref={deckRef}
            aria-label={content.deckLabel}
            data-stacked={isStacked}
            className="case-deck shell mt-16 flex flex-col gap-5 lg:mt-24 lg:gap-4"
          >
            {projects.map((project, position) => (
              <CaseFileCard
                key={project.id}
                project={project}
                position={position}
                actionLabel={content.cardActionLabel}
              />
            ))}
          </ul>
        </div>

        <div className="shell mt-16 flex flex-col gap-8 lg:mt-24 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5">
            <div className="hazard-hatch h-1.5 w-24" />
            <p className="max-w-xl text-lede text-ash">{content.closingPrompt}</p>
          </div>

          <OffsetButton
            href={content.closingActionHref}
            tone="outline"
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
