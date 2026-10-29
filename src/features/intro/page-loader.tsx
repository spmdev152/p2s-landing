"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { LOGO_LETTERS } from "@/components/brand/logo-geometry";

import { useIntroControl } from "./intro-context";
import { INTRO_SEEN_ATTRIBUTE, rememberIntroSeen } from "./intro-session";
import { useLoadProgress } from "./use-load-progress";

import "./intro.css";

/**
 * Stage of the loader.
 *
 * - `loading` — the letters arrive one by one, empty, then fill in turn with
 *   progress while the bar runs.
 * - `reveal` — at 100%, the loader lifts off the page like a shutter, the
 *   letters holding full.
 * - `done` — gone.
 */
type LoaderStage = "loading" | "reveal" | "done";

/**
 * Seconds the loader takes to reach 100% at the very least. Below this the
 * letters' entrance and their fills would be cut short on a fast connection,
 * and a loader that flashes reads as a glitch rather than as an intro.
 */
const MIN_SECONDS = 2.2;

/** Seconds after which the loader gives up waiting and lets the page in. */
const MAX_SECONDS = 7;

/**
 * How quickly the shown progress closes on its target, per second. Applied as
 * an exponential decay over each frame's real duration, so it moves at the
 * same pace on a 60Hz and a 120Hz display.
 */
const CATCH_UP = 5.5;

/**
 * Slowest the shown progress may move while it still has ground to cover, in
 * progress per second. Exponential easing alone crawls ever slower as it nears
 * its target, which drew out the end of the last letter's fill and then had to
 * be cut short; this floor carries it all the way to 100% at a steady pace.
 */
const MIN_PACE = 0.45;

/**
 * Milliseconds the mark holds complete before the shutter lifts, so its last
 * letter is seen full rather than overtaken by the reveal.
 */
const HOLD_MS = 360;

/** Milliseconds the reveal lasts, matching `intro.css`. */
const REVEAL_MS = 1150;

/** Faster timings for visitors who prefer reduced motion: no entrance, a fade out. */
const REDUCED = { minSeconds: 0.5, reveal: 380 } as const;

/**
 * Props accepted by {@link PageLoader}.
 */
export interface PageLoaderProps {
  /** The mark to show, rendered with `fillable` so its letters can fill. */
  readonly logo: ReactNode;
  /**
   * Plays even if this visit has already seen the loader. For review surfaces
   * that replay it on demand; the site itself plays it once per visit.
   */
  readonly always?: boolean;
}

function subscribeNever(): () => void {
  return () => undefined;
}

/**
 * Whether the boot script found that this visit has already seen the loader.
 * Read through an external store so the server and the hydrating client both
 * render the loader, and only the first client render after hydration drops
 * it: the loader is already hidden by CSS by then, so nothing flashes.
 */
function useIntroSeen(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => document.documentElement.hasAttribute(INTRO_SEEN_ATTRIBUTE),
    () => false,
  );
}

/**
 * Share of the overall progress one letter is filled by: the letters fill in
 * reading order, each over its own equal slice of the run.
 *
 * @param progress - Overall progress, `0` to `1`.
 * @param index - Position of the letter.
 * @param count - Number of letters.
 */
function letterFill(progress: number, index: number, count: number): number {
  return Math.min(Math.max(progress * count - index, 0), 1);
}

/**
 * The page's opening. The logotype's letters arrive one by one, whole and
 * empty; then they fill with colour in reading order as the page loads, while
 * a hazard-striped bar runs underneath. At 100% the whole panel lifts away
 * like a shutter, trailing a pulse plane, to reveal the site already
 * animating in.
 *
 * Progress follows the page's real loading but is never allowed to outrun a
 * minimum pace, and never waits longer than a ceiling. Everything per frame is
 * written straight to the DOM; React only renders when the stage changes.
 *
 * The loader tells the intro context when it starts lifting, which is what
 * releases every entrance animation behind it.
 */
export function PageLoader({ logo, always = false }: PageLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<LoaderStage>("loading");
  const progress = useLoadProgress();
  const markReady = useIntroControl();
  const prefersReducedMotion = useReducedMotion();
  const skipped = useIntroSeen() && !always;

  useEffect(() => {
    if (skipped) {
      markReady();
    }
  }, [markReady, skipped]);

  useEffect(() => {
    const { dataset } = document.documentElement;

    if (skipped) {
      return;
    }

    if (stage === "done") {
      delete dataset.loader;
      rememberIntroSeen();
      return;
    }

    dataset.loader = "active";
    return () => {
      delete dataset.loader;
    };
  }, [skipped, stage]);

  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;

    if (skipped || root === null || bar === null) {
      return;
    }

    const fills = LOGO_LETTERS.map(({ key, fillBounds }) => ({
      rect: root.querySelector<SVGRectElement>(`.logo-fill[data-letter="${key}"]`),
      bounds: fillBounds,
    }));

    const minSeconds = prefersReducedMotion ? REDUCED.minSeconds : MIN_SECONDS;
    const start = performance.now();
    let previous = start;
    let shown = 0;
    let frame = 0;
    let hold = 0;

    const paint = (value: number) => {
      bar.style.setProperty("--progress", value.toFixed(4));

      fills.forEach(({ rect, bounds }, index) => {
        if (rect === null) {
          return;
        }

        const height = bounds.height * letterFill(value, index, fills.length);
        rect.setAttribute("y", String(bounds.y + bounds.height - height));
        rect.setAttribute("height", String(height));
      });
    };

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const step = Math.min((now - previous) / 1000, 0.1);
      const real = elapsed >= MAX_SECONDS ? 1 : progress.current;
      const ceiling = Math.min(real, elapsed / minSeconds);

      previous = now;

      const gap = ceiling - shown;
      if (gap > 0) {
        const eased = gap * (1 - Math.exp(-CATCH_UP * step));
        shown = Math.min(ceiling, shown + Math.max(eased, MIN_PACE * step));
      }

      if (shown >= 1) {
        paint(1);
        hold = window.setTimeout(() => setStage("reveal"), prefersReducedMotion ? 0 : HOLD_MS);
        return;
      }

      paint(shown);
      frame = requestAnimationFrame(tick);
    };

    paint(0);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hold);
    };
  }, [prefersReducedMotion, progress, skipped]);

  useEffect(() => {
    if (stage === "reveal") {
      markReady();
      const handle = window.setTimeout(
        () => setStage("done"),
        prefersReducedMotion ? REDUCED.reveal : REVEAL_MS,
      );
      return () => window.clearTimeout(handle);
    }
  }, [markReady, prefersReducedMotion, stage]);

  if (skipped || stage === "done") {
    return null;
  }

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label={stage === "reveal" ? "Loaded" : "Loading"}
      data-stage={stage}
      data-always={always ? "" : undefined}
      className="page-loader"
    >
      <div aria-hidden className="page-loader__plane page-loader__plane--back" />
      <div className="page-loader__plane page-loader__plane--front blueprint-grid">
        <div className="page-loader__content">
          <div className="page-loader__logo">{logo}</div>

          <div ref={barRef} aria-hidden className="page-loader__bar">
            <span className="page-loader__bar-plane" />
            <span className="page-loader__bar-track">
              <span className="page-loader__bar-fill" />
              <span className="page-loader__bar-edge" />
              <span className="page-loader__bar-ticks" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
