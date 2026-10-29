/**
 * A hero call to action.
 */
export interface HeroAction {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** Button label. */
  readonly label: string;
  /** Destination path. */
  readonly href: string;
}

/**
 * Every piece of copy rendered by the hero section.
 *
 * Keeping the content behind an interface lets the hero be reused for other
 * campaigns or locales without touching its markup or animation logic.
 */
export interface HeroContent {
  /** Micro label rendered above the headline. */
  readonly eyebrow: string;
  /**
   * The headline split into explicit lines.
   *
   * Line breaks are authored rather than derived so the display type keeps its
   * intended silhouette at every viewport width.
   */
  readonly headlineLines: readonly string[];
  /** Supporting paragraph beneath the headline. */
  readonly lede: string;
  /** Primary and secondary actions, in render order. */
  readonly actions: readonly HeroAction[];
}

/**
 * Launch copy for the p2s landing page hero.
 */
export const heroContent: HeroContent = {
  eyebrow: "Software studio",
  headlineLines: ["WE PUSH IDEAS INTO", "PRODUCTION-GRADE", "SOFTWARE"],
  lede:
    "Custom software, mobile apps, automations, AI integrations and the infrastructure underneath — designed, built and operated by one senior team.",
  actions: [
    { id: "start", label: "Start a project", href: "#contact" },
    { id: "work", label: "See our work", href: "#work" },
  ],
};
