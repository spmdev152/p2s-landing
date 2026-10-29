/**
 * Restricts a value to an inclusive numeric range.
 *
 * @param value - The value to restrict.
 * @param minimum - Lower bound of the range.
 * @param maximum - Upper bound of the range.
 * @returns The value clamped between `minimum` and `maximum`.
 */
export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

/**
 * Linearly interpolates between two numbers.
 *
 * @param from - Value returned when `amount` is `0`.
 * @param to - Value returned when `amount` is `1`.
 * @param amount - Interpolation factor, normally within `[0, 1]`.
 * @returns The interpolated value.
 */
export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/**
 * Maps a value from an arbitrary range onto the normalized `[0, 1]` range.
 *
 * @param value - The value to normalize.
 * @param minimum - Value that maps to `0`.
 * @param maximum - Value that maps to `1`.
 * @returns The normalized value, clamped to `[0, 1]`.
 */
export function normalize(value: number, minimum: number, maximum: number): number {
  if (maximum === minimum) {
    return 0;
  }

  return clamp((value - minimum) / (maximum - minimum), 0, 1);
}
