import { Anton, Space_Grotesk, Space_Mono } from "next/font/google";

/**
 * Display typeface used for oversized editorial statements.
 *
 * Anton is an ultra-condensed, single-weight grotesque. Its narrow set width lets
 * long uppercase statements span the full measure of the layout without shrinking,
 * which is the structural requirement of the neo-brutalist hero.
 */
export const displayFont = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

/**
 * Primary interface typeface used for body copy, navigation, and controls.
 *
 * Space Grotesk keeps the geometric, slightly mechanical voice of the brand while
 * remaining highly legible at small sizes.
 */
export const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

/**
 * Monospaced typeface reserved for technical micro-labels such as indices,
 * availability notes, and section markers.
 *
 * Space Mono belongs to the same superfamily as {@link bodyFont}, so the pairing
 * shares skeletons and terminals.
 */
export const monoFont = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

/**
 * Space-separated list of every font custom property class.
 *
 * Applying this to the document root exposes `--font-anton`,
 * `--font-space-grotesk`, and `--font-space-mono` to the theme layer.
 */
export const fontVariables = [displayFont.variable, bodyFont.variable, monoFont.variable].join(" ");
