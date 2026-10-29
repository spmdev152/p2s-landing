/**
 * One discipline offered by p2s.
 */
export interface Capability {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** Two digit index rendered as a technical marker. */
  readonly index: string;
  /** Short label used in the hero ticker and the services list. */
  readonly label: string;
  /** One line summary revealed when the discipline is focused. */
  readonly summary: string;
  /** Concrete deliverables, rendered as monospaced chips. */
  readonly tags: readonly string[];
  /** Destination of the discipline's detail page. */
  readonly href: string;
}

/**
 * The six disciplines p2s delivers, in the order they appear across the site.
 */
export const capabilities: readonly Capability[] = [
  {
    id: "software",
    index: "01",
    label: "Software Development",
    summary: "Web platforms, internal tools and APIs built to survive their second year.",
    tags: ["Web platforms", "Internal tools", "APIs"],
    href: "/services/software-development",
  },
  {
    id: "mobile",
    index: "02",
    label: "Mobile Apps",
    summary: "Native and cross-platform products, shipped to both stores from one codebase.",
    tags: ["iOS", "Android", "Cross-platform"],
    href: "/services/mobile-apps",
  },
  {
    id: "automation",
    index: "03",
    label: "Automation",
    summary: "The manual work in your operation, replaced by pipelines that report for duty.",
    tags: ["Workflows", "Data pipelines", "Integrations"],
    href: "/services/automation",
  },
  {
    id: "process",
    index: "04",
    label: "Process Engineering",
    summary: "We map how the work actually happens, then rebuild it around what matters.",
    tags: ["Discovery", "Mapping", "Rollout"],
    href: "/services/process-engineering",
  },
  {
    id: "ai",
    index: "05",
    label: "AI Integration",
    summary: "Models wired into the systems you already run, not a chatbot bolted on top.",
    tags: ["LLM features", "Retrieval", "Agents"],
    href: "/services/ai-integration",
  },
  {
    id: "infrastructure",
    index: "06",
    label: "Infrastructure",
    summary: "Cloud, CI/CD and observability set up so releases stop being an event.",
    tags: ["Cloud", "CI/CD", "Observability"],
    href: "/services/infrastructure",
  },
];
