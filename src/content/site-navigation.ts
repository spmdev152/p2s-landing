/**
 * A single entry in the primary site navigation.
 */
export interface NavigationItem {
  /** Stable identifier used as a React key and as an analytics handle. */
  readonly id: string;
  /** Two digit index rendered as a technical marker beside the label. */
  readonly index: string;
  /** Human readable label. */
  readonly label: string;
  /**
   * Destination. Every entry points at a section of the landing page for now,
   * so the header scrolls rather than navigates.
   */
  readonly href: string;
}

/**
 * Primary navigation of the marketing site.
 *
 * Presentation components receive this collection as a prop rather than
 * importing it directly, which keeps them reusable across locales and future
 * content sources.
 */
export const primaryNavigation: readonly NavigationItem[] = [
  { id: "services", index: "01", label: "Services", href: "#services" },
  { id: "work", index: "02", label: "Work", href: "#work" },
  { id: "approach", index: "03", label: "Approach", href: "#approach" },
  { id: "team", index: "04", label: "Team", href: "#team" },
];

/**
 * Call to action rendered at the end of the header and inside the mobile panel.
 */
export const contactAction = {
  label: "Get in touch",
  href: "#contact",
} as const;
