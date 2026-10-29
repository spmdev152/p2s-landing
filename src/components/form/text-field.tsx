"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/cn";

import { FieldFrame, fieldBorderStyles, fieldControlStyles } from "./field-frame";

/**
 * Input types this field is willing to render.
 *
 * Kept to the two the system actually uses. A field that accepted every native
 * type would have to answer for the ones that come with their own widget —
 * `date`, `color`, `file` — none of which this styling survives.
 */
export type TextFieldType = "text" | "email";

/**
 * Props accepted by {@link TextField}.
 */
export interface TextFieldProps {
  /** Unique identifier for the control. */
  readonly id: string;
  /** Two digit marker rendered before the label. */
  readonly index: string;
  /** Field label. */
  readonly label: string;
  /** Placeholder shown while the field is empty. */
  readonly placeholder: string;
  /** Input type. Defaults to `"text"`. */
  readonly type?: TextFieldType;
  /** Value for the native autofill hint. */
  readonly autoComplete?: string;
  /** Suffix marking the field as skippable. Omit for required fields. */
  readonly optionalLabel?: string;
  /** Current failure message. Omit while the field is valid or untouched. */
  readonly error?: string;
  /** Whether the field has been completed and passes its rules. */
  readonly isValid?: boolean;
  /**
   * The form binding, as one prop rather than a spread of loose handlers.
   *
   * It carries the name, the change and blur listeners and the ref together,
   * which keeps the field's own surface to the things a caller actually decides.
   */
  readonly registration: UseFormRegisterReturn;
}

/**
 * A single line text field.
 */
export function TextField({
  id,
  index,
  label,
  placeholder,
  type = "text",
  autoComplete,
  optionalLabel,
  error,
  isValid = false,
  registration,
}: TextFieldProps) {
  const hasError = error !== undefined;

  return (
    <FieldFrame
      id={id}
      index={index}
      label={label}
      optionalLabel={optionalLabel}
      error={error}
      isValid={isValid}
    >
      <input
        {...registration}
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(fieldControlStyles, fieldBorderStyles(hasError))}
      />
    </FieldFrame>
  );
}
