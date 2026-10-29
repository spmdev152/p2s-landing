"use client";

import { motion, type Variants } from "motion/react";
import { useMemo } from "react";

import { duration, easing } from "@/design-system/tokens";
import { cn } from "@/lib/cn";

import { buildFingerprint, type Fingerprint } from "./project-fingerprint";

/**
 * Props accepted by {@link CaseFilePlate}.
 */
export interface CaseFilePlateProps {
  /** Value the mark is derived from. Normally the project's id. */
  readonly seed: string;
  /** Two digit index drawn as an outline behind the mark. */
  readonly numeral: string;
  /** Additional classes applied to the plate frame. */
  readonly className?: string;
}

/**
 * Fraction of a cell left unpainted on each side, so the grid reads as separate
 * blocks rather than as a single mass.
 */
const CELL_INSET = 0.09;

/**
 * The mark and its offset block move in opposite directions on engagement,
 * which is the depth cue the action controls use, applied to artwork.
 */
const markVariants: Variants = {
  rest: { x: 0, y: 0 },
  active: { x: 5, y: -5 },
};

const blockVariants: Variants = {
  rest: { x: -5, y: 5, opacity: 0.55 },
  active: { x: -14, y: 14, opacity: 1 },
};

const plateTransition = { duration: duration.base, ease: easing.snap };

/**
 * Props accepted by {@link FingerprintMark}.
 */
interface FingerprintMarkProps {
  /** The mark to draw. */
  readonly fingerprint: Fingerprint;
  /**
   * Paints every cell in `currentColor`, ignoring its tier. Used for the offset
   * block, which is a silhouette of the mark rather than a second copy of it.
   */
  readonly flat?: boolean;
}

/**
 * Draws a fingerprint as a grid of hard-edged blocks.
 *
 * Cells are plain elements rather than animated ones: a nine by nine grid is up
 * to eighty-one nodes, and animating each of them individually would cost far
 * more than the effect is worth. The whole mark moves as one instead.
 */
function FingerprintMark({ fingerprint, flat = false }: FingerprintMarkProps) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${fingerprint.size} ${fingerprint.size}`}
      className="size-full overflow-visible"
    >
      {fingerprint.cells.map((cell) => (
        <rect
          key={cell.id}
          x={cell.column + CELL_INSET}
          y={cell.row + CELL_INSET}
          width={1 - CELL_INSET * 2}
          height={1 - CELL_INSET * 2}
          className={
            flat
              ? "fill-current"
              : cell.tier === "signal"
                ? "fill-volt"
                : "fill-chalk/20"
          }
        />
      ))}
    </svg>
  );
}

/**
 * The visual half of a case file card.
 *
 * The plate carries no information the copy does not already state — it exists
 * to give each project a mark you can recognise across the deck. That mark is
 * generated from the project's id rather than authored, so the section stays
 * complete no matter how many projects are added to the content file and long
 * before any of them has photography to show.
 *
 * The mark is sized against the plate's shorter axis — its height while the
 * plate is a full width band on compact layouts, its width once the plate
 * becomes a column panel — so it is never cropped by the frame it sits in.
 */
export function CaseFilePlate({ seed, numeral, className }: CaseFilePlateProps) {
  const fingerprint = useMemo(() => buildFingerprint(seed), [seed]);

  return (
    <div
      aria-hidden
      className={cn(
        "relative isolate size-full overflow-hidden border-2 border-pulse-soft/25 bg-abyss",
        className,
      )}
    >
      <div className="blueprint-grid absolute inset-0 opacity-70" />

      <span className="text-outline absolute -bottom-8 -left-4 font-display text-[10rem] leading-none opacity-70 select-none [--outline-color:var(--color-pulse-soft)] lg:-bottom-14 lg:-left-5 lg:text-[17rem]">
        {numeral}
      </span>

      <div className="absolute inset-0 grid place-items-center justify-items-end p-4 lg:p-10">
        <div className="relative aspect-square h-full w-auto lg:h-auto lg:w-full lg:max-w-60">
          <motion.div
            variants={blockVariants}
            transition={plateTransition}
            className="absolute inset-0 text-pulse will-change-transform"
          >
            <FingerprintMark fingerprint={fingerprint} flat />
          </motion.div>

          <motion.div
            variants={markVariants}
            transition={plateTransition}
            className="absolute inset-0 will-change-transform"
          >
            <FingerprintMark fingerprint={fingerprint} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
