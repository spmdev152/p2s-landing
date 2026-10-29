"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { duration, easing } from "@/design-system/tokens";
import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link FieldFrame}.
 */
export interface FieldFrameProps {
  /**
   * Identifier of the control this frame wraps.
   *
   * The frame derives two more from it — `{id}-label` and `{id}-error` — and
   * controls are expected to point at them with `aria-labelledby` and
   * `aria-describedby`, so the id has to be unique on the page.
   */
  readonly id: string;
  /** Two digit marker rendered before the label. */
  readonly index: string;
  /** Field label. */
  readonly label: string;
  /** Suffix marking the field as skippable. Omit for required fields. */
  readonly optionalLabel?: string;
  /** Current failure message. Omit while the field is valid or untouched. */
  readonly error?: string;
  /** Whether the field has been completed and passes its rules. */
  readonly isValid?: boolean;
  /** The control itself. */
  readonly children: ReactNode;
  /** Additional classes applied to the outermost element. */
  readonly className?: string;
}

/**
 * Height reserved for the failure message whether or not one is showing.
 *
 * Revealing a message that pushes every field below it down the page moves the
 * control the visitor is about to reach for. The slot is always there; only its
 * contents fade.
 */
const MESSAGE_SLOT_HEIGHT = "min-h-4.5";

const messageVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0 },
};

const markerVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1 },
};

/**
 * The shared shell every field in the system is built on.
 *
 * It owns the parts that must not drift between field types: the indexed label,
 * the offset block that lifts out from behind the control on focus, the failure
 * message, and the marker that appears once the field is satisfied.
 *
 * Focus is expressed with `focus-within` rather than React state. The frame
 * wraps controls as different as an input, a textarea and a listbox trigger, and
 * none of them has to report anything back for the frame to light up — which
 * also means the visual state can never fall out of step with the real one.
 */
export function FieldFrame({
  id,
  index,
  label,
  optionalLabel,
  error,
  isValid = false,
  children,
  className,
}: FieldFrameProps) {
  const hasError = error !== undefined;

  return (
    <div className={cn("group/field flex flex-col gap-2.5", className)}>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="flex items-center gap-2.5 font-mono text-eyebrow uppercase"
      >
        <span
          className={cn(
            "transition-colors duration-200",
            hasError ? "text-ember" : "text-ash/60 group-focus-within/field:text-volt",
          )}
        >
          {index}
        </span>
        <span className="text-ash">{label}</span>
        {optionalLabel === undefined ? null : (
          <span className="text-ash/40 normal-case">({optionalLabel})</span>
        )}

        <AnimatePresence>
          {isValid ? (
            <motion.span
              aria-hidden
              variants={markerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: duration.quick, ease: easing.snap }}
              className="size-1.5 rotate-45 bg-volt"
            />
          ) : null}
        </AnimatePresence>
      </label>

      <div className="relative">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-all duration-300 ease-snap",
            "group-focus-within/field:translate-x-[5px] group-focus-within/field:translate-y-[5px] group-focus-within/field:opacity-100",
            hasError ? "bg-ember/70" : "bg-pulse",
          )}
        />
        <div className="relative">{children}</div>
      </div>

      <div className={cn(MESSAGE_SLOT_HEIGHT, "flex")}>
        <AnimatePresence mode="wait">
          {hasError ? (
            <motion.p
              key={error}
              id={`${id}-error`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: duration.quick, ease: easing.quick }}
              className="font-mono text-[0.6875rem] leading-tight tracking-[0.04em] text-ember"
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Classes shared by every control the frame wraps.
 *
 * The native focus ring is suppressed here and replaced, not removed: on focus
 * the border becomes `volt` against `carbon` and the offset block lifts out
 * behind the control, which is a far stronger indicator than the 2px outline it
 * replaces and clears the contrast requirement several times over.
 */
export const fieldControlStyles =
  "w-full border-2 bg-carbon px-4 py-3.5 text-chalk transition-colors duration-200 outline-none placeholder:text-ash/40";

/**
 * Border treatment for a control, chosen by its current state.
 *
 * @param hasError - Whether the field is currently failing its rules.
 * @returns The border classes to apply.
 */
export function fieldBorderStyles(hasError: boolean): string {
  return hasError
    ? "border-ember focus:border-ember"
    : "border-chalk/25 hover:border-chalk/40 focus:border-volt";
}
