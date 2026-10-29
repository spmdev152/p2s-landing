"use client";

import { useSyncExternalStore } from "react";

const FINE_POINTER_QUERY = "(pointer: fine)";

function subscribe(onStoreChange: () => void): () => void {
  const query = window.matchMedia(FINE_POINTER_QUERY);
  query.addEventListener("change", onStoreChange);

  return () => {
    query.removeEventListener("change", onStoreChange);
  };
}

function getSnapshot(): boolean {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Reports whether the primary input device can point precisely.
 *
 * Backed by {@link useSyncExternalStore} rather than an effect, because
 * `matchMedia` is exactly the kind of external store it exists for: the
 * subscription is set up without a synchronous state write, and the server
 * snapshot is pessimistic so any pointer-only affordance is absent from the
 * server render and appears after hydration instead of causing a mismatch.
 *
 * @returns `true` when the primary pointer is a mouse, trackpad, or stylus.
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
