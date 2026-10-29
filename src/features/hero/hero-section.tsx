"use client";

import { motion } from "motion/react";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { MicroTag } from "@/components/ui/micro-tag";
import { OffsetButton } from "@/components/ui/offset-button";
import type { Capability } from "@/content/capabilities";
import type { HeroContent } from "@/content/hero-content";
import { duration, easing, heroEntranceDelay } from "@/design-system/tokens";
import { useIntroReady } from "@/features/intro";
import { RocketScene, SCENE_DEPTH } from "@/features/scene";

import { CapabilityTicker } from "./capability-ticker";
import { HeroHeadline } from "./hero-headline";

/**
 * Props accepted by {@link HeroSection}.
 */
export interface HeroSectionProps {
  /** Copy and actions to render. */
  readonly content: HeroContent;
  /** Disciplines scrolled through in the closing band. */
  readonly capabilities: readonly Capability[];
}

/**
 * Builds the entrance transition for an element that rises into place.
 *
 * @param delay - Seconds to wait, measured from the start of the hero sequence.
 * @param ready - Whether the page loader has lifted; until then the element
 * holds its starting pose.
 * @returns Motion props describing the entrance.
 */
function rise(delay: number, ready: boolean) {
  const hidden = { opacity: 0, y: 22 };

  return {
    initial: hidden,
    animate: ready ? { opacity: 1, y: 0 } : hidden,
    transition: { duration: duration.slow, ease: easing.snap, delay: heroEntranceDelay + delay },
  };
}

/**
 * Where the rig sits in the hero. Wide screens put it on the right with the
 * copy beside it; narrower ones centre the rocket below the copy, cropping the
 * tail of the flame rather than the rider.
 */
const RIG_PLACEMENT =
  "scene-launch bottom-[1%] left-[-44%] w-[150%] sm:left-[-22%] sm:w-[112%] lg:right-[-4%] lg:bottom-[2%] lg:left-auto lg:w-[60%] xl:right-[-5%] xl:w-[68%]";

/**
 * The sky keeps its bottom edge and leans left, where the copy sits, so the
 * densest clouds frame the statement rather than hide behind the rig.
 */
const SKY_ANCHOR = [0.3, 1] as const;

/**
 * On a tall phone the sky would have to grow several times wider than the
 * screen to cover it. Past this it stops growing and leaves the top to the
 * gradient and the stars, which is where the copy sits anyway.
 */
const MAX_SKY_SCALE = 2.2;

/**
 * Keeps the copy clear of the rig on screens where the rig sits below it. The
 * height matches the rig's box: its width share times the illustration's
 * aspect ratio.
 */
const RIG_CLEARANCE = "h-[84vw] sm:h-[63vw] lg:hidden";

/**
 * The landing page hero: the whole first screen is the rocket scene.
 *
 * The statement is layered into the scene rather than laid over it. It sits in
 * front of the back clouds and behind the mid clouds, the rig and the front
 * clouds, so clouds sail across its lower lines and the rider passes in front
 * of it. That only works because neither the stage nor any wrapper around the
 * statement creates a stacking context: every layer, the type included, is
 * ordered by z-index within the section. A soft veil between the back clouds and
 * the type keeps the copy legible whatever drifts behind it.
 *
 * The supporting copy and the actions sit above everything, since they have to
 * stay readable and clickable.
 */
export function HeroSection({ content, capabilities }: HeroSectionProps) {
  const ready = useIntroReady();

  return (
    <>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
        <RocketScene rigClassName={RIG_PLACEMENT} skyAnchor={SKY_ANCHOR} maxSkyScale={MAX_SKY_SCALE} />

        <div
          aria-hidden
          className="scene-veil pointer-events-none absolute inset-0"
          style={{ zIndex: SCENE_DEPTH.headline - 5 }}
        />

        <div className="header-offset relative flex flex-1 flex-col">
          <div className="shell flex flex-col pt-8 pb-6 lg:pt-12 lg:pb-16">
            <motion.div
              {...rise(0, ready)}
              className="relative flex flex-wrap items-center gap-3"
              style={{ zIndex: SCENE_DEPTH.interface }}
            >
              <MicroTag className="border-volt/40 bg-abyss/60 text-volt">{content.eyebrow}</MicroTag>
            </motion.div>

            <HeroHeadline
              lines={content.headlineLines}
              className="relative mt-6 lg:mt-8"
              style={{ zIndex: SCENE_DEPTH.headline }}
            />

            <motion.div
              {...rise(0.45, ready)}
              className="relative flex max-w-lg flex-col gap-7 pt-8 lg:pt-10"
              style={{ zIndex: SCENE_DEPTH.interface }}
            >
              <p className="text-lede text-chalk/85">{content.lede}</p>

              <div className="flex flex-wrap items-center gap-4">
                {content.actions.map((action, index) => (
                  <OffsetButton
                    key={action.id}
                    href={action.href}
                    tone={index === 0 ? "volt" : "outline"}
                  >
                    {action.label}
                    <ArrowUpRight />
                  </OffsetButton>
                ))}
              </div>
            </motion.div>
          </div>

          <div aria-hidden className={RIG_CLEARANCE} />
        </div>
      </section>

      <CapabilityTicker capabilities={capabilities} />
    </>
  );
}
