import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link ChevronDown}.
 */
export interface ChevronDownProps {
  /** Additional classes applied to the SVG root. */
  readonly className?: string;
}

/**
 * Disclosure chevron used by the select control.
 *
 * Drawn with `currentColor` and a square line cap so it inherits both the tone
 * of its parent control and the hard-edged geometry of the system.
 */
export function ChevronDown({ className }: ChevronDownProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="square"
      className={cn("size-3.5", className)}
    >
      <path d="M3 6l5 5 5-5" />
    </svg>
  );
}
