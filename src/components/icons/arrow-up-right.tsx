import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link ArrowUpRight}.
 */
export interface ArrowUpRightProps {
  /** Additional classes applied to the SVG root. */
  readonly className?: string;
}

/**
 * Outbound arrow used inside action labels.
 *
 * Drawn with `currentColor` and a square line cap so it inherits both the tone
 * of its parent control and the hard-edged geometry of the system.
 */
export function ArrowUpRight({ className }: ArrowUpRightProps) {
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
      <path d="M4 12 12 4" />
      <path d="M5.5 4H12v6.5" />
    </svg>
  );
}
