"use client";

import { useEffect, useRef } from "react";

/**
 * Share of the progress each source accounts for. Images dominate because the
 * hero is an illustration: until its pieces are in, the page is not ready to
 * be seen.
 */
const WEIGHT = { document: 0.1, fonts: 0.15, images: 0.75 } as const;

/**
 * Tracks how much of the page has actually loaded, as a fraction from `0` to
 * `1`, without rendering: the value lives in a ref the caller reads each
 * frame.
 *
 * Progress is the weighted sum of three real signals: the document having
 * hydrated, the web fonts being ready, and the share of images in the document
 * that have finished loading. The window's `load` event settles it at `1`,
 * since by then every resource the page asked for has arrived.
 *
 * @returns A ref holding the current real progress.
 */
export function useLoadProgress() {
  const progress = useRef<number>(WEIGHT.document);

  useEffect(() => {
    let fontsDone = false;
    let loadedImages = 0;
    const images = Array.from(document.images);

    const update = () => {
      if (document.readyState === "complete") {
        progress.current = 1;
        return;
      }

      const imageShare = images.length === 0 ? 1 : loadedImages / images.length;
      progress.current = WEIGHT.document + (fontsDone ? WEIGHT.fonts : 0) + WEIGHT.images * imageShare;
    };

    const onImageSettled = () => {
      loadedImages += 1;
      update();
    };

    const pending: HTMLImageElement[] = [];
    for (const image of images) {
      if (image.complete) {
        loadedImages += 1;
      } else {
        image.addEventListener("load", onImageSettled, { once: true });
        image.addEventListener("error", onImageSettled, { once: true });
        pending.push(image);
      }
    }

    document.fonts.ready.then(() => {
      fontsDone = true;
      update();
    });

    window.addEventListener("load", update);
    update();

    return () => {
      window.removeEventListener("load", update);
      for (const image of pending) {
        image.removeEventListener("load", onImageSettled);
        image.removeEventListener("error", onImageSettled);
      }
    };
  }, []);

  return progress;
}
