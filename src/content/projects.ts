/**
 * A single quantified outcome of a project.
 *
 * Metrics are optional on {@link Project} because not every engagement can be
 * reduced to a number that is both true and publishable.
 */
export interface ProjectMetric {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** The figure itself, pre-formatted for display. */
  readonly value: string;
  /** What the figure measures. */
  readonly label: string;
}

/**
 * One piece of work in the case file deck.
 */
export interface Project {
  /**
   * Stable identifier used as a React key and as the seed of the generated
   * fingerprint, so a project's mark never changes once it is published.
   */
  readonly id: string;
  /** Two digit index rendered as a technical marker. */
  readonly index: string;
  /** Project name, set in display type as the card's heading. */
  readonly name: string;
  /** Sector or client type, rendered in the card's header strip. */
  readonly discipline: string;
  /** Year of delivery, rendered in the card's header strip. */
  readonly year: string;
  /** Two or three sentences describing the problem and what was built. */
  readonly summary: string;
  /** Technologies and deliverables, rendered as monospaced chips. */
  readonly tags: readonly string[];
  /** Quantified outcomes. Omitted when there is nothing publishable. */
  readonly metrics?: readonly ProjectMetric[];
  /** Destination of the project's case study page. */
  readonly href: string;
}

/**
 * The work p2s puts forward, in deck order.
 *
 * **Placeholder copy.** Every name, summary and metric below stands in for real
 * client work and must be replaced before launch. The shapes are what matter:
 * a summary of two to three sentences and at most three metrics keep every card
 * inside the deck's stage height at the large breakpoint.
 */
export const projects: readonly Project[] = [
  {
    id: "atlas",
    index: "01",
    name: "Atlas",
    discipline: "Logistics",
    year: "2025",
    summary:
      "A fleet operator ran its entire dispatch on a spreadsheet that three people edited at once. We replaced it with a real-time platform: live vehicle state, automated route assignment, and a driver app that works with no signal.",
    tags: ["Next.js", "PostgreSQL", "React Native", "Event sourcing"],
    metrics: [
      { id: "dispatch", value: "-68%", label: "Dispatch time" },
      { id: "vehicles", value: "1.2K", label: "Vehicles tracked" },
      { id: "uptime", value: "99.9%", label: "Uptime" },
    ],
    href: "/work/atlas",
  },
  {
    id: "meridian",
    index: "02",
    name: "Meridian",
    discipline: "Fintech",
    year: "2025",
    summary:
      "Month-end close took nine days and a room full of analysts reconciling exports by hand. We built the pipeline that ingests every source, matches the ledger automatically, and surfaces only what genuinely needs a human.",
    tags: ["Python", "dbt", "Airflow", "LLM extraction"],
    metrics: [
      { id: "close", value: "9d → 1d", label: "Time to close" },
      { id: "matched", value: "94%", label: "Auto-matched" },
    ],
    href: "/work/meridian",
  },
  {
    id: "kiln",
    index: "03",
    name: "Kiln",
    discipline: "Manufacturing",
    year: "2024",
    summary:
      "Twelve production lines, no shared view of any of them. We instrumented the floor, put the telemetry behind one API, and gave supervisors a control room that tells them a line is drifting before it stops.",
    tags: ["Go", "TimescaleDB", "MQTT", "Grafana"],
    metrics: [
      { id: "downtime", value: "-41%", label: "Unplanned downtime" },
      { id: "signals", value: "8M/day", label: "Signals ingested" },
    ],
    href: "/work/kiln",
  },
  {
    id: "verso",
    index: "04",
    name: "Verso",
    discipline: "Legal",
    year: "2024",
    summary:
      "A practice drowning in contract review. We shipped a retrieval system that reads the clause library, drafts the redline, and cites its source on every suggestion — so the lawyer checks the work instead of doing it twice.",
    tags: ["TypeScript", "pgvector", "Claude", "Evals"],
    metrics: [
      { id: "review", value: "-73%", label: "Review time" },
      { id: "cited", value: "100%", label: "Cited suggestions" },
    ],
    href: "/work/verso",
  },
];
