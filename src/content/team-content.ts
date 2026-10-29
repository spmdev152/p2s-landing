/**
 * A portrait and how to frame it.
 */
export interface TeamPortrait {
  /** Image source: a path under `public/` or an allowed remote URL. */
  readonly src: string;
  /** Description of the photo for assistive technology. */
  readonly alt: string;
  /**
   * Focal point kept in frame when the photo is cropped, as a CSS
   * `object-position`. Defaults to the centre.
   */
  readonly focus?: string;
}

/**
 * One person on the team.
 */
export interface TeamMember {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** Two digit marker. */
  readonly index: string;
  /** Full name. */
  readonly name: string;
  /** Role, rendered beside the marker. */
  readonly role: string;
  /** A few lines on what this person does on a project. */
  readonly bio: string;
  /** Areas this person owns, rendered as monospaced chips. */
  readonly focus: readonly string[];
  /** Their photo. */
  readonly portrait: TeamPortrait;
}

/**
 * Every piece of copy rendered by the team section.
 */
export interface TeamContent {
  /** Section marker rendered above the heading. */
  readonly eyebrow: string;
  /** Oversized numeral drawn as an outline behind the section. */
  readonly numeral: string;
  /** Heading, split into the lines it should render on. */
  readonly headingLines: readonly string[];
  /** Supporting paragraph beside the heading. */
  readonly lede: string;
  /** Accessible name of the list of people. */
  readonly membersLabel: string;
  /** Label rendered on each portrait, after the person's marker. */
  readonly portraitLabel: string;
  /** The people, in render order. */
  readonly members: readonly TeamMember[];
}

/**
 * Launch copy for the p2s team section.
 *
 * Names, bios and portraits are placeholders until the founders' own are in.
 * The portraits come from a public avatar service, which `next.config.ts`
 * allows for that reason alone.
 */
export const teamContent: TeamContent = {
  eyebrow: "04 / Team",
  numeral: "04",
  headingLines: ["TWO FOUNDERS.", "NO MIDDLEMEN."],
  lede:
    "p2s is small on purpose. The people who scope your project are the people who build it, ship it and pick up when something breaks.",
  membersLabel: "Founders",
  portraitLabel: "Co-founder",
  members: [
    {
      id: "alex",
      index: "01",
      name: "Alex Moreno",
      role: "Engineering",
      bio: "Architecture, backends and the pipelines that deploy them. Reviews every merge before it reaches production, and is the one who answers when production does something strange.",
      focus: ["Architecture", "Backend", "Infrastructure", "Security"],
      portrait: {
        src: "https://i.pravatar.cc/600?img=59",
        alt: "Portrait of Alex Moreno",
        focus: "50% 35%",
      },
    },
    {
      id: "lucia",
      index: "02",
      name: "Lucía Navarro",
      role: "Product & delivery",
      bio: "Turns a messy brief into a written plan with a price and a date, runs the weekly demo and writes the Friday update. Ask a question and this is who answers it, in plain words.",
      focus: ["Discovery", "Product", "Automation", "AI"],
      portrait: {
        src: "https://i.pravatar.cc/600?img=26",
        alt: "Portrait of Lucía Navarro",
        focus: "50% 30%",
      },
    },
  ],
};
