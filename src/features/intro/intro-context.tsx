"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Whether the page loader has lifted, and how to say that it has.
 */
interface IntroState {
  /** `true` once the loader starts revealing the page. */
  readonly ready: boolean;
  /** Called by the loader as its reveal begins. */
  readonly markReady: () => void;
}

const IntroContext = createContext<IntroState>({ ready: true, markReady: () => undefined });

/**
 * Holds the moment the page loader lifts, so entrance animations can wait for
 * it instead of playing out unseen behind it.
 *
 * The same moment is mirrored onto `<html data-intro>` for animations that
 * live in CSS rather than in Motion, such as the rocket's launch. The root
 * layout renders the attribute as `pending`, so those animations are held from
 * the very first paint.
 */
export function IntroProvider({ children }: { readonly children: ReactNode }) {
  const [ready, setReady] = useState(false);

  const markReady = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    setReady(true);
  }, []);

  const value = useMemo(() => ({ ready, markReady }), [ready, markReady]);

  return <IntroContext value={value}>{children}</IntroContext>;
}

/**
 * Reports whether the page loader has lifted. Outside an {@link IntroProvider}
 * it is always `true`, so components that wait on it still animate anywhere
 * they are rendered without a loader.
 */
export function useIntroReady(): boolean {
  return useContext(IntroContext).ready;
}

/**
 * The loader's handle on the intro state.
 */
export function useIntroControl(): () => void {
  return useContext(IntroContext).markReady;
}
