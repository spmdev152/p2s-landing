"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { useEffect, type MouseEvent } from "react";

import { OffsetButton } from "@/components/ui/offset-button";
import type { Capability } from "@/content/capabilities";
import { contactAction, type NavigationItem } from "@/content/site-navigation";
import { duration, easing } from "@/design-system/tokens";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { scrollToSection } from "@/lib/scroll-to-section";

/**
 * Props accepted by {@link MobileNavPanel}.
 */
export interface MobileNavPanelProps {
  /** DOM id, referenced by the toggle through `aria-controls`. */
  readonly id: string;
  /** Navigation entries to render. */
  readonly navigation: readonly NavigationItem[];
  /** Disciplines listed beneath the navigation. */
  readonly capabilities: readonly Capability[];
  /** Invoked when the panel requests to be closed. */
  readonly onDismiss: () => void;
}

const panelVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: duration.slow, ease: easing.snap, staggerChildren: 0.05, delayChildren: 0.12 },
  },
  leaving: { clipPath: "inset(0 0 100% 0)", transition: { duration: duration.base, ease: easing.quick } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.snap } },
  leaving: { opacity: 0 },
};

/**
 * Full-height navigation overlay shown on compact viewports.
 *
 * Closes on Escape as well as on link activation, and locks document scrolling
 * while it is open.
 */
export function MobileNavPanel({ id, navigation, capabilities, onDismiss }: MobileNavPanelProps) {
  useBodyScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDismiss]);

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    scrollToSection(event);
    onDismiss();
  };

  return (
    <motion.div
      id={id}
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="leaving"
      className="header-offset fixed inset-0 z-40 overflow-y-auto bg-abyss lg:hidden"
    >
      <div className="blueprint-grid flex min-h-full flex-col justify-between gap-12 px-5 pt-10 pb-12">
        <nav aria-label="Primary">
          <ul className="flex flex-col">
            {navigation.map((item) => (
              <motion.li
                key={item.id}
                variants={itemVariants}
                className="border-b-2 border-chalk/10"
              >
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-baseline gap-3 py-4"
                >
                  <span className="font-mono text-[0.625rem] text-volt">{item.index}</span>
                  <span className="font-display text-display uppercase">{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <p className="font-mono text-eyebrow text-ash uppercase">What we do</p>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <li key={capability.id} className="flex items-start gap-2 text-sm text-pulse-pale">
                <span aria-hidden className="mt-1.5 size-1.5 shrink-0 bg-volt" />
                {capability.label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <OffsetButton href={contactAction.href} onClick={onDismiss} className="w-full">
            {contactAction.label}
          </OffsetButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
