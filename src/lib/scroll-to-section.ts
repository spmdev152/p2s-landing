import type { MouseEvent } from "react";

/**
 * Click handler for links that point at a section of the current page.
 *
 * Glides to the section instead of jumping, or jumps when the visitor prefers
 * reduced motion, and mirrors the hash in the address bar so the position can
 * be shared. Next.js would otherwise resolve the hash itself, but it skips the
 * scroll whenever the section's top edge is already on screen and resets to the
 * top of the document first, which makes a smooth glide stutter.
 *
 * Anything that is not a plain left click on an in-page hash link is left to
 * the browser, so opening a section in a new tab keeps working.
 *
 * @param event - The click on the link.
 */
export function scrollToSection(event: MouseEvent<HTMLAnchorElement>): void {
  const href = event.currentTarget.getAttribute("href");

  if (
    href === null ||
    !href.startsWith("#") ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const target = document.getElementById(decodeURIComponent(href.slice(1)));

  if (target === null) {
    return;
  }

  event.preventDefault();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });

  // The router keeps its own data in the history entry, so it is carried over.
  window.history.replaceState(window.history.state, "", href);
}
