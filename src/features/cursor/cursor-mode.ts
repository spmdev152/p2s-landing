/**
 * What the pointer is currently resting on.
 *
 * Press is deliberately not a mode: it is orthogonal to what is underneath the
 * pointer, so the renderer composes the two rather than this module flattening
 * them into one union.
 */
export type CursorMode = "default" | "action" | "text";

/**
 * Elements the cursor should read as activatable.
 *
 * `data-cursor="action"` is the extension point: any component can opt into the
 * action treatment without this module having to know it exists.
 */
const ACTION_SELECTOR = [
  "a[href]",
  "button",
  "summary",
  "label",
  '[role="button"]',
  '[role="link"]',
  '[data-cursor="action"]',
].join(", ");

/**
 * Elements the cursor should read as selectable prose.
 */
const TEXT_SELECTOR = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "blockquote",
  "figcaption",
  "input",
  "textarea",
  '[data-cursor="text"]',
].join(", ");

/**
 * Resolves which mode the cursor should adopt for a given event target.
 *
 * Action wins over text, which is what makes nested cases behave: a heading
 * inside a link resolves to `action` because the lookup walks up to the nearest
 * activatable ancestor before it ever considers prose.
 *
 * @param target - The event target under the pointer.
 * @returns The mode the cursor should render.
 */
export function resolveCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) {
    return "default";
  }

  if (target.closest(ACTION_SELECTOR) !== null) {
    return "action";
  }

  if (target.closest(TEXT_SELECTOR) !== null) {
    return "text";
  }

  return "default";
}
