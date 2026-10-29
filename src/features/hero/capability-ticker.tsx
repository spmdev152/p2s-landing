"use client";

import { motion } from "motion/react";

import { Marquee } from "@/components/ui/marquee";
import type { Capability } from "@/content/capabilities";
import { duration, easing } from "@/design-system/tokens";
import { useIntroReady } from "@/features/intro";

/**
 * Props accepted by {@link CapabilityTicker}.
 */
export interface CapabilityTickerProps {
  /** Disciplines to scroll through. */
  readonly capabilities: readonly Capability[];
}

/**
 * Full-bleed band listing every discipline p2s delivers.
 *
 * The band is the loudest surface on the page by design: it terminates the hero
 * with a hard horizontal edge and carries the only large field of the structural
 * accent color.
 *
 * The list is also rendered in a visually hidden element so the disciplines are
 * announced once, in order, rather than repeatedly as the track loops.
 */
export function CapabilityTicker({ capabilities }: CapabilityTickerProps) {
  const ready = useIntroReady();

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: ready ? "0%" : "100%" }}
      transition={{ duration: duration.slow, ease: easing.snap, delay: 0.7 }}
      className="relative border-t-2 border-volt bg-pulse py-4"
    >
      <h2 className="sr-only">What we do</h2>
      <ul className="sr-only">
        {capabilities.map((capability) => (
          <li key={capability.id}>{capability.label}</li>
        ))}
      </ul>

      <Marquee cycleSeconds={38}>
        <div aria-hidden className="flex items-center">
          {capabilities.map((capability) => (
            <div key={capability.id} className="flex items-center">
              <span className="font-display text-ticker text-volt uppercase">
                {capability.label}
              </span>
              <span className="mx-6 size-2 rotate-45 bg-pulse-pale lg:mx-9" />
            </div>
          ))}
        </div>
      </Marquee>
    </motion.div>
  );
}
