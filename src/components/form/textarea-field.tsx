"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/cn";

import { FieldFrame, fieldBorderStyles, fieldControlStyles } from "./field-frame";

/**
 * Props accepted by {@link TextAreaField}.
 */
export interface TextAreaFieldProps {
  /** Unique identifier for the control. */
  readonly id: string;
  /** Two digit marker rendered before the label. */
  readonly index: string;
  /** Field label. */
  readonly label: string;
  /** Placeholder shown while the field is empty. */
  readonly placeholder: string;
  /** Visible height in lines. Defaults to `5`. */
  readonly rows?: number;
  /** Current failure message. Omit while the field is valid or untouched. */
  readonly error?: string;
  /** Whether the field has been completed and passes its rules. */
  readonly isValid?: boolean;
  /**
   * The form binding, carrying the name, the change and blur listeners and the
   * ref together as one prop.
   */
  readonly registration: UseFormRegisterReturn;
}

/**
 * A multi-line text field.
 *
 * Resizing is limited to the vertical axis: the control is a grid cell, and
 * letting it grow sideways would push it out of its column.
 */
export function TextAreaField({
  id,
  index,
  label,
  placeholder,
  rows = 5,
  error,
  isValid = false,
  registration,
}: TextAreaFieldProps) {
  const hasError = error !== undefined;

  return (
    <FieldFrame id={id} index={index} label={label} error={error} isValid={isValid}>
      <textarea
        {...registration}
        id={id}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(
          fieldControlStyles,
          fieldBorderStyles(hasError),
          "resize-y leading-relaxed",
        )}
      />
    </FieldFrame>
  );
}
