import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link MicroTag}.
 */
export interface MicroTagProps {
  /** Label content, rendered in monospaced uppercase. */
  readonly children: ReactNode;
  /**
   * Renders a pulsing indicator before the label. Use it only for genuinely
   * live information such as current availability.
   */
  readonly live?: boolean;
  /** Additional classes applied to the outermost element. */
  readonly className?: string;
}

/**
 * A hairline outlined micro-label used for technical annotations.
 *
 * The tag carries no semantics of its own; wrap it in a heading or list when the
 * surrounding content requires them.
 */
export function MicroTag({ children, live = false, className }: MicroTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border-2 border-chalk/15 px-3 py-2 font-mono text-eyebrow text-ash uppercase",
        className,
      )}
    >
      {live ? (
        <span aria-hidden className="relative flex size-2 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-volt opacity-70" />
          <span className="relative size-2 rounded-full bg-volt" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
