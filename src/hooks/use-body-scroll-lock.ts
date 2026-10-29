"use client";

import { useEffect } from "react";

/**
 * Prevents the document from scrolling while an overlay is open.
 *
 * The previous `overflow` value is restored on cleanup so the hook composes
 * safely with any other code that manipulates the same property.
 *
 * @param locked - Whether scrolling should currently be suppressed.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
