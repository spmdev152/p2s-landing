"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { MicroTag } from "@/components/ui/micro-tag";
import type { ContactContent } from "@/content/contact-content";

import { ContactForm } from "./contact-form";
import type { ContactRequest, ContactSubmissionResult } from "./contact-request";

/**
 * Props accepted by {@link ContactSection}.
 */
export interface ContactSectionProps {
  /** Copy, options and validation messages. */
  readonly content: ContactContent;
  /** Transport the form hands accepted requests to. */
  readonly onSubmit: (request: ContactRequest) => Promise<ContactSubmissionResult>;
}

/**
 * Scroll range over which the section's parallax layers travel.
 */
const PARALLAX_RANGE = ["start end", "end start"] as const;

/**
 * Travel of the outlined section numeral, as a fraction of its own height.
 *
 * Anchored to the lower right corner, so unlike the work section's numeral it
 * bleeds off two edges at once and may travel in both directions without ever
 * being shaved against an edge that is not there.
 */
const NUMERAL_DRIFT = ["10%", "-18%"] as const;

/**
 * Horizontal travel of the two heading lines.
 *
 * Absolute units, bounded by the shell's narrowest gutter. See
 * `services-section.tsx` for what a percentage does here.
 */
const HEADING_DRIFT = {
  first: ["-1rem", "0.8rem"],
  second: ["0.9rem", "-1rem"],
} as const;

/**
 * The contact section.
 *
 * The form takes the wider column and the aside carries the two things that
 * actually reduce hesitation before someone writes: what happens to the message
 * afterwards, and a way to skip the form entirely.
 */
export function ContactSection({ content, onSubmit }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [...PARALLAX_RANGE],
  });

  const numeralDrift = useTransform(scrollYProgress, [0, 1], [...NUMERAL_DRIFT]);
  const firstLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.first]);
  const secondLineDrift = useTransform(scrollYProgress, [0, 1], [...HEADING_DRIFT.second]);

  return (
    <section ref={sectionRef} id="contact" className="relative isolate py-24 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.span
          style={{ y: numeralDrift }}
          className="text-outline absolute -right-10 -bottom-12 font-display text-[22rem] leading-none opacity-20 select-none [--outline-color:var(--color-pulse-soft)] lg:text-[34rem]"
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

        <div className="shell mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm content={content} onSubmit={onSubmit} />
          </div>

          <aside className="flex flex-col gap-10 lg:col-span-5">
            <div className="flex flex-col gap-6">
              <div className="hazard-hatch h-1.5 w-24" />

              <h3 className="font-mono text-eyebrow tracking-[0.18em] text-ash uppercase">
                {content.stepsTitle}
              </h3>

              <ol className="flex flex-col">
                {content.steps.map((step) => (
                  <li
                    key={step.id}
                    className="flex gap-5 border-l-2 border-chalk/12 pt-1 pb-8 pl-5 last:pb-0"
                  >
                    <span className="mt-0.5 font-mono text-eyebrow text-volt">{step.index}</span>
                    <div className="flex flex-col gap-1.5">
                      <p className="font-display text-lg text-chalk uppercase">{step.title}</p>
                      <p className="text-sm leading-relaxed text-ash">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col items-start gap-3 border-2 border-chalk/12 bg-carbon/60 p-6">
              <span className="font-mono text-eyebrow text-ash/60 uppercase">
                {content.directLabel}
              </span>
              <a
                href={`mailto:${content.directEmail}`}
                className="group inline-flex items-center gap-2 font-display text-xl text-volt uppercase transition-colors duration-200 hover:text-volt-deep lg:text-2xl"
              >
                {content.directEmail}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
