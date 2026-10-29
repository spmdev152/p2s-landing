"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { duration, easing } from "@/design-system/tokens";
import { cn } from "@/lib/cn";
import { scrollToSection } from "@/lib/scroll-to-section";

/**
 * Animatable Next.js link, used so the interactive element and the element that
 * owns the hover and press states are one and the same.
 */
const MotionLink = motion.create(Link);

/**
 * Visual treatments available to {@link OffsetButton}.
 */
export type OffsetButtonTone = "volt" | "outline" | "pulse";

/**
 * Size steps available to {@link OffsetButton}.
 */
export type OffsetButtonSize = "compact" | "regular";

/**
 * Props accepted by {@link OffsetButton}.
 *
 * The surface is deliberately narrow: a button in this system is a label, a
 * destination or a handler, and a visual tone. Anything broader would leak
 * layout concerns into a component that several unrelated sections depend on.
 */
export interface OffsetButtonProps {
  /** Content rendered inside the button surface. */
  readonly children: ReactNode;
  /**
   * Destination. When present the button renders as a link; a `#section` hash
   * glides to that section of the current page.
   */
  readonly href?: string;
  /** Invoked on activation, after a link has started its own navigation. */
  readonly onClick?: () => void;
  /**
   * Native button behaviour. Ignored when {@link OffsetButtonProps.href} is set,
   * since a link cannot submit anything.
   *
   * `"submit"` exists because implicit form submission needs a real submit
   * button in the form: without one, pressing Enter in a field with siblings
   * does nothing at all.
   */
  readonly type?: "button" | "submit";
  /**
   * Prevents activation. Ignored when {@link OffsetButtonProps.href} is set —
   * there is no honest way to disable a link, so a caller that needs a disabled
   * state should render a button.
   */
  readonly disabled?: boolean;
  /** Visual treatment. Defaults to `"volt"`. */
  readonly tone?: OffsetButtonTone;
  /** Size step. Defaults to `"regular"`. */
  readonly size?: OffsetButtonSize;
  /** Accessible name, required when the label alone is not descriptive. */
  readonly ariaLabel?: string;
  /** Additional classes applied to the outermost element. */
  readonly className?: string;
}

const toneSurfaceStyles: Record<OffsetButtonTone, string> = {
  volt: "border-volt bg-volt text-void",
  outline: "border-chalk/30 bg-void text-chalk",
  pulse: "border-pulse bg-pulse text-chalk",
};

const toneShadowStyles: Record<OffsetButtonTone, string> = {
  volt: "bg-pulse",
  outline: "bg-volt",
  pulse: "bg-volt",
};

const sizeStyles: Record<OffsetButtonSize, string> = {
  compact: "px-4 py-3 text-[0.6875rem]",
  regular: "px-6 py-4 text-[0.8125rem]",
};

/**
 * Motion states shared by the surface and its offset block.
 *
 * At rest the block peeks out from behind the surface. Hovering pushes the two
 * layers apart to suggest the control lifting off the page, and pressing
 * collapses them into a single plane.
 */
const surfaceVariants: Variants = {
  rest: { x: 0, y: 0 },
  hover: { x: -2, y: -2 },
  press: { x: 5, y: 5 },
};

const shadowVariants: Variants = {
  rest: { x: 5, y: 5 },
  hover: { x: 8, y: 8 },
  press: { x: 5, y: 5 },
};

/**
 * A neo-brutalist action control built from two stacked planes.
 *
 * Renders a Next.js link when {@link OffsetButtonProps.href} is provided and a
 * native button otherwise, so semantics always match behaviour.
 */
export function OffsetButton({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  tone = "volt",
  size = "regular",
  ariaLabel,
  className,
}: OffsetButtonProps) {
  const surface = (
    <>
      <motion.span
        aria-hidden
        variants={shadowVariants}
        transition={{ duration: duration.quick, ease: easing.quick }}
        className={cn(
          "absolute inset-0 rounded-brutal",
          toneShadowStyles[tone],
        )}
      />
      <motion.span
        variants={surfaceVariants}
        transition={{ duration: duration.quick, ease: easing.quick }}
        className={cn(
          "relative flex w-full items-center justify-center gap-2 rounded-brutal border-2 font-bold uppercase tracking-[0.08em] whitespace-nowrap",
          toneSurfaceStyles[tone],
          sizeStyles[size],
        )}
      >
        {children}
      </motion.span>
    </>
  );

  const sharedProps = {
    initial: "rest",
    animate: "rest",
    whileHover: "hover",
    whileFocus: "hover",
    whileTap: "press",
    "aria-label": ariaLabel,
    className: cn("relative inline-flex rounded-brutal", className),
  } as const;

  if (href !== undefined) {
    return (
      <MotionLink
        href={href}
        onClick={(event) => {
          scrollToSection(event);
          onClick?.();
        }}
        {...sharedProps}
      >
        {surface}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...sharedProps}
      className={cn(sharedProps.className, disabled && "pointer-events-none opacity-55")}
    >
      {surface}
    </motion.button>
  );
}
