"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { OffsetButton } from "@/components/ui/offset-button";
import type { Capability } from "@/content/capabilities";
import { contactAction, type NavigationItem } from "@/content/site-navigation";
import { duration, easing } from "@/design-system/tokens";
import { useIntroReady } from "@/features/intro";

import { MenuToggle } from "./menu-toggle";
import { MobileNavPanel } from "./mobile-nav-panel";
import { NavLink } from "./nav-link";
import { useScrollElevation } from "./use-scroll-elevation";

const MOBILE_PANEL_ID = "primary-navigation-panel";

/**
 * Props accepted by {@link SiteHeader}.
 */
export interface SiteHeaderProps {
  /** Navigation entries to render. */
  readonly navigation: readonly NavigationItem[];
  /** Disciplines listed inside the mobile panel. */
  readonly capabilities: readonly Capability[];
}

/**
 * Fixed site header.
 *
 * Sits transparently over the hero at the top of the page and fades in an opaque
 * backing plate once the page scrolls, so the display type behind it is never
 * competing with the navigation for contrast.
 *
 * The bar is layered above the mobile panel. The panel is fixed to the whole
 * viewport at z-40 inside the header, so without a higher layer the bar would
 * sit under the panel's opaque background and the mark and the toggle would
 * vanish the moment the menu opened.
 */
export function SiteHeader({ navigation, capabilities }: SiteHeaderProps) {
  const isElevated = useScrollElevation();
  const introReady = useIntroReady();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = useCallback(() => {
    setIsPanelOpen((current) => !current);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  return (
    <motion.header
      initial={{ y: "-110%" }}
      animate={{ y: introReady ? "0%" : "-110%" }}
      transition={{ duration: duration.slow, ease: easing.snap, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: isElevated || isPanelOpen ? 1 : 0 }}
        transition={{ duration: duration.quick, ease: easing.quick }}
        className="absolute inset-0 border-b-2 border-volt/25 bg-void/85 backdrop-blur-xl"
      />

      <div className="header-height shell relative z-50 flex items-center justify-between gap-6">
        <BrandMark expanded={isPanelOpen} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navigation.map((item) => (
              <li key={item.id}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <OffsetButton
            href={contactAction.href}
            size="compact"
            className="hidden sm:inline-flex"
          >
            {contactAction.label}
          </OffsetButton>

          <MenuToggle
            isOpen={isPanelOpen}
            onToggle={togglePanel}
            controls={MOBILE_PANEL_ID}
            className="lg:hidden"
          />
        </div>
      </div>

      <AnimatePresence>
        {isPanelOpen ? (
          <MobileNavPanel
            id={MOBILE_PANEL_ID}
            navigation={navigation}
            capabilities={capabilities}
            onDismiss={closePanel}
          />
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
