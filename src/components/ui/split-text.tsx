"use client";

import { motion, type Variants } from "motion/react";

import { characterStagger, duration, easing } from "@/design-system/tokens";
import { cn } from "@/lib/cn";

/**
 * Vertical padding, in `em`, added above each clipping line box.
 *
 * Display type is set at a line height below `1`, so glyphs overflow their line
 * box. Without this allowance the clipping mask would shave the cap heights.
 * The matching negative margin removes the padding from layout again, keeping
 * the rendered leading exactly equal to the configured line height.
 */
const ASCENDER_ALLOWANCE = "0.34em";

/**
 * Vertical padding, in `em`, added below each clipping line box.
 */
const DESCENDER_ALLOWANCE = "0.08em";

/**
 * Distance each character travels before settling, as a percentage of its own
 * line box. Large enough that the glyph clears the padded mask completely.
 */
const TRAVEL = "140%";

/**
 * Rendered in place of a space so that the surrounding inline block always
 * reserves the advance width of the glyph.
 */
const NON_BREAKING_SPACE = " ";

/**
 * Timing input resolved per character by {@link characterVariants}.
 */
interface CharacterTiming {
  /** Seconds to wait before the first character of the whole block moves. */
  readonly delay: number;
  /** Position of this character within the block, counted across all lines. */
  readonly index: number;
}

/**
 * Props accepted by {@link SplitText}.
 */
export interface SplitTextProps {
  /** The text, already split into the lines it should render on. */
  readonly lines: readonly string[];
  /** Seconds to wait before the first character moves. */
  readonly delay?: number;
  /** Additional classes applied to the outermost element. */
  readonly className?: string;
  /** Additional classes applied to each line. */
  readonly lineClassName?: string;
  /** Holds the characters hidden until `true`. Defaults to playing on mount. */
  readonly play?: boolean;
}

const characterVariants: Variants = {
  hidden: { y: TRAVEL },
  visible: ({ delay, index }: CharacterTiming) => ({
    y: "0%",
    transition: {
      duration: duration.glacial,
      delay: delay + index * characterStagger,
      ease: easing.snap,
    },
  }),
};

/**
 * The mask's padding is cancelled by an equal negative margin so the rendered
 * leading matches the configured line height exactly. A flex column container is
 * required for that to hold: in normal flow the negative margins of adjacent
 * lines would collapse into one another and reintroduce the padding as leading.
 */
const lineMaskStyle = {
  paddingTop: ASCENDER_ALLOWANCE,
  marginTop: `-${ASCENDER_ALLOWANCE}`,
  paddingBottom: DESCENDER_ALLOWANCE,
  marginBottom: `-${DESCENDER_ALLOWANCE}`,
} as const;

/**
 * Reveals pre-split text one character at a time from behind a clipping mask.
 *
 * The rendered output is hidden from assistive technology because a per
 * character DOM is unreadable by screen readers. Callers are responsible for
 * exposing the same string through a semantic element, typically a visually
 * hidden heading.
 */
export function SplitText({ lines, delay = 0, className, lineClassName, play = true }: SplitTextProps) {
  let characterIndex = -1;

  return (
    <motion.span
      aria-hidden
      initial="hidden"
      animate={play ? "visible" : "hidden"}
      className={cn("flex flex-col", className)}
    >
      {lines.map((line) => (
        <span
          key={line}
          className={cn("block overflow-hidden whitespace-nowrap", lineClassName)}
          style={lineMaskStyle}
        >
          {Array.from(line).map((character, indexWithinLine) => {
            characterIndex += 1;

            return (
              <motion.span
                key={`${line}-${indexWithinLine}`}
                custom={{ delay, index: characterIndex } satisfies CharacterTiming}
                variants={characterVariants}
                className="inline-block will-change-transform"
              >
                {character === " " ? NON_BREAKING_SPACE : character}
              </motion.span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}
