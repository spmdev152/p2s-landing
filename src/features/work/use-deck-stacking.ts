"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Narrowest viewport at which the deck is allowed to pin.
 *
 * Below it the card is a single column and therefore tall, and the geometry
 * check would never pass anyway. The explicit floor also keeps mobile browsers
 * out of the calculation entirely: their toolbars change the viewport height
 * mid-scroll, and a deck that started and stopped pinning as the address bar
 * collapsed would be far worse than one that never pinned at all.
 */
const MINIMUM_STACKING_WIDTH = 1024;

/**
 * Decides whether the case file deck can pin its cards.
 *
 * A card pinned at an offset that pushes its lower edge past the bottom of the
 * viewport hides part of itself with no way to scroll to it, because the whole
 * point of pinning is that the card stops moving. The only honest test is
 * therefore arithmetic on real measurements: the deepest card's offset, plus
 * the tallest card, plus the closing gutter, has to fit on screen.
 *
 * Measuring rather than declaring a breakpoint is what makes the section safe
 * to hand real copy. A summary two lines longer than the placeholder changes
 * the answer, and this recomputes it instead of stacking regardless.
 *
 * @param deckRef - Ref to the list element carrying the `case-deck` class.
 * @returns Whether the deck should stack. Always `false` on the first render,
 * since nothing can be measured on the server.
 */
export function useDeckStacking(deckRef: RefObject<HTMLUListElement | null>): boolean {
  const [isStacked, setIsStacked] = useState(false);

  useEffect(() => {
    const deck = deckRef.current;

    if (deck === null) {
      return;
    }

    const measure = () => {
      const cards = Array.from(deck.children) as HTMLElement[];
      const deepestCard = cards.at(-1);

      if (deepestCard === undefined || window.innerWidth < MINIMUM_STACKING_WIDTH) {
        setIsStacked(false);
        return;
      }

      const gutter = Number.parseFloat(
        window.getComputedStyle(deck).getPropertyValue("--deck-gutter"),
      );
      const deepestOffset = Number.parseFloat(window.getComputedStyle(deepestCard).top);
      const tallest = Math.max(...cards.map((card) => card.getBoundingClientRect().height));

      setIsStacked(deepestOffset + tallest + gutter <= window.innerHeight);
    };

    measure();

    /*
      Card heights move for reasons a resize listener never sees: the display
      face swapping in, or an image inside a card finishing its decode.
    */
    const observer = new ResizeObserver(measure);
    observer.observe(deck);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [deckRef]);

  return isStacked;
}
