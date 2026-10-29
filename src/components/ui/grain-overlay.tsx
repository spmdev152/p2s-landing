import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link GrainOverlay}.
 */
export interface GrainOverlayProps {
  /** Additional classes applied to the overlay. */
  readonly className?: string;
}

/**
 * Fixed film grain layer that sits above the page and below interactive content.
 *
 * It breaks up the large flat fields of the dark palette, which would otherwise
 * band on wide gamut displays.
 */
export function GrainOverlay({ className }: GrainOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "film-grain pointer-events-none fixed inset-0 z-[60] opacity-[0.16] mix-blend-overlay",
        className,
      )}
    />
  );
}
