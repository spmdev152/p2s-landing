import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { themeColorTokens } from "@/design-system/tokens";

/**
 * Class name merger taught about the p2s theme scales.
 *
 * Out of the box the merger only recognises Tailwind's stock scales, so a custom
 * font size such as `text-hero` is indistinguishable from a custom text color
 * such as `text-volt` and the two cancel each other out. Declaring the scales
 * here restores correct conflict resolution.
 */
const merge = extendTailwindMerge({
  extend: {
    theme: {
      color: [...themeColorTokens],
      font: ["display", "sans", "mono"],
      text: ["hero", "section", "display", "ticker", "lede", "eyebrow", "nav"],
      ease: ["quick", "snap", "inout-quick"],
      radius: ["brutal"],
      container: ["shell"],
    },
  },
});

/**
 * Combines conditional class names and resolves conflicting Tailwind utilities so
 * that the last declaration always wins.
 *
 * @param inputs - Any mix of strings, arrays, or conditional class maps.
 * @returns A single, deduplicated class name string.
 */
export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
