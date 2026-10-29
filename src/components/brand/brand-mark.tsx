"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { duration, easing } from "@/design-system/tokens";
import { cn } from "@/lib/cn";

import logoLong from "../../../public/brand/logo-long.svg";
import logoShort from "../../../public/brand/logo-short.svg";

/**
 * Props accepted by {@link BrandMark}.
 */
export interface BrandMarkProps {
  /**
   * Shows the long wordmark in place of the short mark. The header sets it
   * while the mobile menu is open, where the bar has room for the full name.
   */
  readonly expanded?: boolean;
  /** Additional classes applied to the link. */
  readonly className?: string;
}

/** How the two marks trade places. */
const swap = { duration: duration.quick, ease: easing.quick } as const;

/**
 * The p2s mark, linking home: the short logotype, or the long wordmark when
 * `expanded`.
 *
 * Both are plain SVG files rather than inlined, so the header's client bundle
 * carries none of their path data and the browser caches them across pages.
 * The static imports give each its intrinsic size at build time, so nothing
 * shifts while they load. The short mark is preloaded because it is above the
 * fold everywhere; the long one is only mounted once it is asked for, so
 * visitors who never open the menu never download it.
 *
 * The two share one grid cell and cross-fade. On hover and keyboard focus the
 * visible mark inverts its colours, turning into its own negative.
 */
export function BrandMark({ expanded = false, className }: BrandMarkProps) {
  const markClass =
    "ease-quick w-auto transition-[filter] duration-200 [grid-area:1/1] group-hover:invert group-focus-visible:invert";

  return (
    <Link
      href="/"
      aria-label="push2solutions — home"
      className={cn("group grid items-center justify-items-start", className)}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: expanded ? 0 : 1, scale: expanded ? 0.92 : 1 }}
        transition={swap}
        className="block origin-left [grid-area:1/1]"
      >
        <Image src={logoShort} alt="" preload unoptimized className={cn(markClass, "h-8 lg:h-10")} />
      </motion.span>

      <AnimatePresence>
        {expanded ? (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={swap}
            className="block [grid-area:1/1]"
          >
            <Image src={logoLong} alt="" unoptimized className={cn(markClass, "h-7 lg:h-9")} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </Link>
  );
}
