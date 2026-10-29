/**
 * Copy rendered by the work section frame.
 *
 * Kept behind an interface for the same reason as the hero and the services
 * index: the section should be reusable for another locale or campaign without
 * touching its markup.
 */
export interface WorkContent {
  /** Section marker rendered above the heading. */
  readonly eyebrow: string;
  /** Oversized numeral drawn as an outline behind the section. */
  readonly numeral: string;
  /** Heading, split into the lines it should render on. */
  readonly headingLines: readonly string[];
  /** Supporting paragraph beside the heading. */
  readonly lede: string;
  /** Accessible name of the deck's list of case files. */
  readonly deckLabel: string;
  /** Label rendered above the deck progress rail. */
  readonly railLabel: string;
  /** Call to action rendered inside every case file card. */
  readonly cardActionLabel: string;
  /** Closing prompt rendered beneath the deck. */
  readonly closingPrompt: string;
  /** Label of the closing action. */
  readonly closingActionLabel: string;
  /** Destination of the closing action. */
  readonly closingActionHref: string;
}

/**
 * Launch copy for the p2s work section.
 */
export const workContent: WorkContent = {
  eyebrow: "02 / Work",
  numeral: "02",
  headingLines: ["SHIPPED.", "IN PRODUCTION."],
  lede:
    "Every engagement below is running today, owned by the people we handed it to. No concepts, no pitch decks — systems with users on them.",
  deckLabel: "Selected case files",
  railLabel: "Case file",
  cardActionLabel: "Read the case file",
  closingPrompt:
    "The work that fits your operation is rarely the work on a landing page. Tell us what is breaking and we will tell you what we would build.",
  closingActionLabel: "See every project",
  closingActionHref: "/work",
};
