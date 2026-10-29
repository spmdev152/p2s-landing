import { cn } from "@/lib/cn";

/**
 * Props accepted by {@link BlueprintBackdrop}.
 */
export interface BlueprintBackdropProps {
  /** Additional classes applied to the layer. */
  readonly className?: string;
}

/**
 * The engineering grid behind the whole document.
 *
 * One layer rather than one per section, and the distinction is visible: a grid
 * painted by each section restarts at that section's own top edge, so wherever a
 * section's height is not an exact multiple of the 5rem cell the row at the seam
 * is cut short and the cells there read as rectangles. Anchoring a single layer
 * to the document keeps every cell square from the header down.
 *
 * The consequence is that page sections must not paint their own background —
 * an opaque surface above this layer simply hides it. Cards and framed panels
 * still do, because they are meant to read as solid planes sitting on the grid.
 *
 * It is positioned but carries no `z-index`, which places it above the body
 * background and below every section: those are positioned too and come later in
 * the document. A negative `z-index` would put it *underneath* the body
 * background instead, and it would never be seen.
 */
export function BlueprintBackdrop({ className }: BlueprintBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn("blueprint-grid pointer-events-none absolute inset-0", className)}
    />
  );
}
