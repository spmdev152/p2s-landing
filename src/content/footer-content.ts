import { primaryNavigation, type NavigationItem } from "./site-navigation";

/**
 * Every piece of copy rendered by the site footer.
 */
export interface FooterContent {
  /** Micro label opening the footer. */
  readonly eyebrow: string;
  /** Closing statement, split into the lines it should render on. */
  readonly statementLines: readonly string[];
  /** Supporting sentence set opposite the statement. */
  readonly tagline: string;
  /** Heading of the column listing the page's sections. */
  readonly indexTitle: string;
  /** Every section of the page, in order. */
  readonly index: readonly NavigationItem[];
  /** Heading of the column listing the disciplines. */
  readonly disciplinesTitle: string;
  /** Where each discipline links to. */
  readonly disciplinesHref: string;
  /** Legal name rendered after the copyright year. */
  readonly legalName: string;
  /** Rights notice following the legal name. */
  readonly rightsNotice: string;
  /** Closing line opposite the copyright notice. */
  readonly signature: string;
}

/**
 * Launch copy for the p2s footer.
 *
 * No address here: the contact section sits directly above and already offers
 * one. The index extends the header's navigation with the contact section the
 * header reaches through its own action.
 */
export const footerContent: FooterContent = {
  eyebrow: "End of transmission",
  statementLines: ["STILL HERE?", "LET'S BUILD IT."],
  tagline:
    "Custom software, mobile apps, automations, AI integrations and the infrastructure underneath — from one senior team.",
  indexTitle: "Index",
  index: [
    ...primaryNavigation,
    { id: "contact", index: "05", label: "Contact", href: "#contact" },
  ],
  disciplinesTitle: "Disciplines",
  disciplinesHref: "#services",
  legalName: "push2solutions",
  rightsNotice: "All rights reserved.",
  signature: "Designed, built and operated in-house",
};
