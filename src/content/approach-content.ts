/**
 * One line of a principle's readout: a check and the state it reports.
 */
export interface ApproachReadoutLine {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** What is being checked. */
  readonly label: string;
  /** The state it reports. */
  readonly value: string;
}

/**
 * One of the principles the approach section is built around.
 */
export interface ApproachPrinciple {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** Two digit marker. */
  readonly index: string;
  /** Short name of the principle, rendered in the card's header strip. */
  readonly kicker: string;
  /** The principle stated as a headline. */
  readonly title: string;
  /** What the principle means in practice. */
  readonly summary: string;
  /** Concrete commitments that follow from it. */
  readonly commitments: readonly string[];
  /** Command printed at the top of the readout. */
  readonly readoutCommand: string;
  /** The readout itself: checks and their states. */
  readonly readout: readonly ApproachReadoutLine[];
}

/**
 * Every piece of copy rendered by the approach section.
 */
export interface ApproachContent {
  /** Section marker rendered above the heading. */
  readonly eyebrow: string;
  /** Oversized numeral drawn as an outline behind the section. */
  readonly numeral: string;
  /** Heading, split into the lines it should render on. */
  readonly headingLines: readonly string[];
  /** Supporting paragraph beside the heading. */
  readonly lede: string;
  /** Accessible name of the list of principles. */
  readonly principlesLabel: string;
  /** Heading of each card's list of commitments. */
  readonly commitmentsTitle: string;
  /** The principles, in render order. */
  readonly principles: readonly ApproachPrinciple[];
  /** Closing prompt rendered beneath the principles. */
  readonly closingPrompt: string;
  /** Label of the closing action. */
  readonly closingActionLabel: string;
  /** Destination of the closing action. */
  readonly closingActionHref: string;
}

/**
 * Launch copy for the p2s approach section.
 */
export const approachContent: ApproachContent = {
  eyebrow: "03 / Approach",
  numeral: "03",
  headingLines: ["THREE RULES.", "NO SMALL PRINT."],
  lede:
    "Speed is easy to promise. We would rather promise code your next team can pick up, systems that are secure before anyone asks, and a conversation that never needs a translator.",
  principlesLabel: "How we work",
  commitmentsTitle: "In practice",
  principles: [
    {
      id: "quality",
      index: "01",
      kicker: "Code quality",
      title: "Built to be inherited.",
      summary:
        "We write for the engineer who takes over, not for the demo. Readable, typed, tested and documented, so whoever comes next is productive on day one, not month three.",
      commitments: [
        "Every change reviewed by a second senior engineer",
        "Typed end to end and tested on every merge",
        "Architecture decisions written down and shipped with the code",
        "Your repository, your accounts, from the first commit",
      ],
      readoutCommand: "review --strict",
      readout: [
        { id: "lint", label: "Lint", value: "0 warnings" },
        { id: "types", label: "Types", value: "0 errors" },
        { id: "tests", label: "Tests", value: "Passing" },
        { id: "review", label: "Review", value: "Approved" },
      ],
    },
    {
      id: "security",
      index: "02",
      kicker: "Security",
      title: "Secure before anyone asks.",
      summary:
        "Security is not a phase bolted on before launch. It is decided in the architecture, enforced by the pipeline and written down before anything goes live.",
      commitments: [
        "Least-privilege access and secrets kept out of the code",
        "Dependencies scanned and patched on every build",
        "Data encrypted in transit and at rest",
        "A written security review and GDPR check before launch",
      ],
      readoutCommand: "audit --all",
      readout: [
        { id: "secrets", label: "Secrets", value: "Vaulted" },
        { id: "deps", label: "Dependencies", value: "Scanned" },
        { id: "traffic", label: "Traffic", value: "TLS only" },
        { id: "data", label: "Data", value: "Encrypted" },
      ],
    },
    {
      id: "communication",
      index: "03",
      kicker: "Communication",
      title: "Plain words, every week.",
      summary:
        "You talk to the people building your product, in your language. No account managers relaying messages, no jargon, no surprises on the invoice.",
      commitments: [
        "A direct channel with the engineers on your project",
        "A working demo every week, never a status deck",
        "A written update every Friday: done, next, blocked",
        "Scope and price agreed in writing before we start",
      ],
      readoutCommand: "status --weekly",
      readout: [
        { id: "channel", label: "Channel", value: "Direct" },
        { id: "demo", label: "Demo", value: "Weekly" },
        { id: "report", label: "Report", value: "Fridays" },
        { id: "surprises", label: "Surprises", value: "None" },
      ],
    },
  ],
  closingPrompt:
    "None of this lives only on a landing page. Every rule above goes into the proposal you sign, so you can hold us to it.",
  closingActionLabel: "Hold us to it",
  closingActionHref: "#contact",
};
