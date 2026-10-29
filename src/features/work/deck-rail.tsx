"use client";

import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link DeckRail}.
 */
export interface DeckRailProps {
  /** Marker of each case file, in deck order. */
  readonly markers: readonly string[];
  /** Zero-based position of the case file currently at the top of the deck. */
  readonly activeIndex: number;
  /** Label rendered above the markers. */
  readonly label: string;
}

/**
 * Position indicator for the case file deck.
 *
 * The stacked header strips already record what has been read; the rail is the
 * other half of that — it shows what is still ahead. It is decorative and
 * hidden from assistive technology, because the list it mirrors is already in
 * the document and announcing a second copy would only add noise.
 *
 * Shown only from the extra large breakpoint, where there is dead margin beside
 * the deck to put it in without stealing width from the cards.
 */
export function DeckRail({ markers, activeIndex, label }: DeckRailProps) {
  return (
    <div aria-hidden className="flex flex-col items-end gap-4">
      <span className="font-mono text-[0.5625rem] tracking-[0.18em] text-ash/60 uppercase">
        {label}
      </span>

      <ul className="flex flex-col items-end gap-3">
        {markers.map((marker, position) => {
          const isActive = position === activeIndex;

          return (
            <li key={marker} className="flex items-center gap-3">
              <span
                className={cn(
                  "font-mono text-[0.625rem] tracking-[0.12em] transition-colors duration-300",
                  isActive ? "text-volt" : "text-ash/35",
                )}
              >
                {marker}
              </span>
              <span
                className={cn(
                  "h-0.5 transition-all duration-300",
                  isActive ? "w-10 bg-volt" : "w-4 bg-chalk/20",
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
