/**
 * Copy rendered by the services section.
 *
 * Kept behind an interface for the same reason as the hero: the section should
 * be reusable for another locale or campaign without touching its markup.
 */
export interface ServicesContent {
  /** Section marker rendered above the heading. */
  readonly eyebrow: string;
  /** Oversized numeral drawn as an outline behind the section. */
  readonly numeral: string;
  /** Heading, split into the lines it should render on. */
  readonly headingLines: readonly string[];
  /** Supporting paragraph beside the heading. */
  readonly lede: string;
  /** Closing prompt rendered beneath the list. */
  readonly closingPrompt: string;
  /** Label of the closing action. */
  readonly closingActionLabel: string;
  /** Destination of the closing action. */
  readonly closingActionHref: string;
}

/**
 * Launch copy for the p2s services section.
 */
export const servicesContent: ServicesContent = {
  eyebrow: "01 / Services",
  numeral: "01",
  headingLines: ["SIX DISCIPLINES.", "ONE TEAM."],
  lede:
    "You should not need five vendors and a project manager to translate between them. We cover the whole surface — from the interface down to the pipeline that deploys it.",
  closingPrompt:
    "Not sure which of these you need? Working that out is usually the first thing we do together.",
  closingActionLabel: "Book a discovery call",
  closingActionHref: "#contact",
};
