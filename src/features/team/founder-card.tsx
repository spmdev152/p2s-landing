"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";

import type { TeamMember } from "@/content/team-content";
import { duration, easing } from "@/design-system/tokens";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * Props accepted by {@link FounderCard}.
 */
export interface FounderCardProps {
  /** The person to render. */
  readonly member: TeamMember;
  /** Label rendered on the portrait, after the person's marker. */
  readonly portraitLabel: string;
}

/**
 * The reveal runs like the page loader's shutter: the brand gradient lifts off
 * the photo from the bottom up, led by a volt edge, and drops back over it when
 * the pointer leaves.
 */
const shutterTransition = { duration: duration.slow, ease: easing.snap };

const gradientVariants: Variants = {
  rest: { clipPath: "inset(0% 0% 0% 0%)", transition: shutterTransition },
  revealed: { clipPath: "inset(0% 0% 100% 0%)", transition: shutterTransition },
};

/**
 * The volt edge rides the gradient's lower edge: parked on the frame's bottom
 * while the gradient covers the photo, and carried out over the top as it
 * lifts.
 */
const edgeVariants: Variants = {
  rest: { top: "100%", transition: shutterTransition },
  revealed: { top: "0%", transition: shutterTransition },
};

/**
 * Under the overlay the photo is held in greyscale and slightly pushed in, so
 * the gradient, blended in hard light, reads as a pulse-to-volt duotone that
 * keeps the face legible. Revealed, it settles back with its own colour.
 */
const photoVariants: Variants = {
  rest: {
    scale: 1.06,
    filter: "grayscale(1) contrast(1.12)",
    transition: { duration: duration.glacial, ease: easing.snap },
  },
  revealed: {
    scale: 1,
    filter: "grayscale(0) contrast(1)",
    transition: { duration: duration.glacial, ease: easing.snap },
  },
};

/** The offset plane behind the portrait, parting from it on reveal. */
const planeVariants: Variants = {
  rest: { x: 6, y: 6, transition: shutterTransition },
  revealed: { x: 10, y: 10, transition: shutterTransition },
};

/**
 * One founder: a portrait washed in the brand gradient, and beneath it the
 * person's role, name, what they do on a project and the areas they own.
 *
 * With a mouse the gradient lifts while the pointer is over the photo itself;
 * the copy beneath it does not trigger anything. Touch screens have no hover,
 * so there the portrait reveals itself whenever it is mostly on screen and
 * washes back over as it leaves, which keeps the effect reachable instead of
 * leaving the photo tinted for good.
 */
export function FounderCard({ member, portraitLabel }: FounderCardProps) {
  const finePointer = useFinePointer();
  const trigger = finePointer
    ? { animate: "rest", whileHover: "revealed" }
    : { whileInView: "revealed", viewport: { amount: 0.6 } };

  return (
    <article aria-labelledby={`founder-${member.id}`} className="flex flex-col gap-8">
      <div className="relative pr-2.5 pb-2.5">
        <motion.div initial="rest" {...trigger} className="group relative">
          <motion.span
            aria-hidden
            variants={planeVariants}
            className="absolute inset-0 bg-pulse"
          />

          <div className="relative isolate aspect-[4/5] overflow-hidden border-2 border-chalk/14 bg-carbon transition-colors duration-300 group-hover:border-volt sm:aspect-[5/4] md:aspect-[4/5] xl:aspect-[5/4]">
            <motion.div variants={photoVariants} className="absolute inset-0">
              <Image
                src={member.portrait.src}
                alt={member.portrait.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: member.portrait.focus }}
              />
            </motion.div>

            <motion.div
              aria-hidden
              variants={gradientVariants}
              className="absolute inset-0 bg-linear-to-tr from-pulse from-30% to-volt mix-blend-hard-light"
            />
            <motion.span
              aria-hidden
              variants={edgeVariants}
              className="absolute inset-x-0 h-1 -translate-y-full bg-volt"
            />

            <span className="absolute top-4 left-4 inline-flex items-center gap-2 border-2 border-chalk/20 bg-void/70 px-3 py-2 font-mono text-eyebrow text-chalk uppercase backdrop-blur-sm">
              <span className="text-volt">{member.index}</span>
              {portraitLabel}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-eyebrow text-volt uppercase">{member.role}</span>
          <h3 id={`founder-${member.id}`} className="font-display text-display text-chalk uppercase">
            {member.name}
          </h3>
        </div>

        <p className="max-w-lg text-[0.9375rem] leading-relaxed text-ash">{member.bio}</p>

        <ul className="flex flex-wrap gap-2">
          {member.focus.map((area) => (
            <li
              key={area}
              className="border-2 border-chalk/15 px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.1em] text-ash uppercase"
            >
              {area}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
