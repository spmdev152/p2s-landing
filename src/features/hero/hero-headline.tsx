"use client";

import type { CSSProperties } from "react";

import { SplitText } from "@/components/ui/split-text";
import { heroEntranceDelay } from "@/design-system/tokens";
import { useIntroReady } from "@/features/intro";
import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link HeroHeadline}.
 */
export interface HeroHeadlineProps {
  /** The headline, already split into the lines it should render on. */
  readonly lines: readonly string[];
  /** Additional classes applied to the heading. */
  readonly className?: string;
  /** Inline styles for the heading, such as its depth within the hero scene. */
  readonly style?: CSSProperties;
}

/**
 * The hero's primary heading.
 *
 * Renders the statement twice: once as plain text for assistive technology and
 * search engines, and once as animated per-character type for sighted users.
 * The characters wait for the page loader to lift before they type in.
 */
export function HeroHeadline({ lines, className, style }: HeroHeadlineProps) {
  const ready = useIntroReady();

  return (
    <h1 className={cn("font-display text-hero text-volt uppercase", className)} style={style}>
      <span className="sr-only">{lines.join(" ")}</span>
      <SplitText lines={lines} delay={heroEntranceDelay} play={ready} />
    </h1>
  );
}
