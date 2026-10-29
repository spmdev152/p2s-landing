"use client";

import { useMotionValue, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { type CursorMode, resolveCursorMode } from "./cursor-mode";

/**
 * Everything the renderer needs to draw the cursor.
 */
export interface CursorState {
  /** What the pointer is resting on. */
  readonly mode: CursorMode;
  /** Whether a pointer button is currently down. */
  readonly isPressed: boolean;
  /** Whether the pointer is inside the document. */
  readonly isVisible: boolean;
  /** Viewport X of the pointer, in pixels. */
  readonly x: MotionValue<number>;
  /** Viewport Y of the pointer, in pixels. */
  readonly y: MotionValue<number>;
}

/**
 * Off-screen origin, so the cursor never flashes at the top left corner on the
 * frame before the first pointer event arrives.
 */
const OFFSCREEN = -200;

/**
 * Tracks the pointer and resolves what it is hovering.
 *
 * Position is written to motion values rather than React state: a `pointermove`
 * fires on every frame the mouse moves, and routing that through a re-render
 * would drop frames. Mode and press are genuine state changes, so they do use
 * React state, and they only change when the pointer crosses an element
 * boundary or a button goes down.
 *
 * @returns The current cursor state.
 */
export function useCursorState(): CursorState {
  const x = useMotionValue(OFFSCREEN);
  const y = useMotionValue(OFFSCREEN);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      if (!hasEnteredRef.current) {
        hasEnteredRef.current = true;
        setIsVisible(true);
      }
    };

    const handleOver = (event: PointerEvent) => {
      setMode(resolveCursorMode(event.target));
    };

    const handleDown = () => {
      setIsPressed(true);
    };

    const handleUp = () => {
      setIsPressed(false);
    };

    const handleLeave = () => {
      hasEnteredRef.current = false;
      setIsVisible(false);
      setIsPressed(false);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("blur", handleLeave);
    document.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", handleLeave);
      document.removeEventListener("pointerleave", handleLeave);
    };
  }, [x, y]);

  return { mode, isPressed, isVisible, x, y };
}
