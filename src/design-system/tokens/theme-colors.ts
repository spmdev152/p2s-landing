import { clamp } from "@/lib/math";

/**
 * Every color token exposed by the theme layer.
 *
 * The names are the single source of truth on the TypeScript side; the values
 * themselves live only in `design-system/styles/theme.css` so the palette is
 * never duplicated across languages.
 */
export const themeColorTokens = [
  "void",
  "abyss",
  "carbon",
  "volt",
  "volt-deep",
  "pulse",
  "pulse-soft",
  "pulse-pale",
  "ember",
  "chalk",
  "ash",
] as const;

/**
 * Union of the color token names declared in {@link themeColorTokens}.
 */
export type ThemeColorToken = (typeof themeColorTokens)[number];

/**
 * Resolves a theme color token to its computed value at runtime.
 *
 * Canvas and WebGL renderers cannot consume CSS custom properties directly, so
 * they read them through this function instead of hard-coding hex literals. That
 * keeps the stylesheet authoritative for the whole palette.
 *
 * @param token - The color token to resolve.
 * @param fallback - Value returned when the property is unavailable, which
 * happens during server rendering and before the stylesheet has been applied.
 * @returns The resolved CSS color value.
 */
export function readThemeColor(token: ThemeColorToken, fallback: string): string {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${token}`)
    .trim();

  return value.length > 0 ? value : fallback;
}

/**
 * Converts a six digit hexadecimal color into an `rgba()` string.
 *
 * @param hexColor - A color in `#rrggbb` form.
 * @param alpha - Opacity within `[0, 1]`.
 * @returns The color with the requested alpha applied, or the input untouched
 * when it is not a six digit hexadecimal value.
 */
export function withAlpha(hexColor: string, alpha: number): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hexColor.trim());

  if (match === null) {
    return hexColor;
  }

  const channels = Number.parseInt(match[1], 16);
  const red = (channels >> 16) & 255;
  const green = (channels >> 8) & 255;
  const blue = channels & 255;

  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
}
