/**
 * One option offered by a contact form select.
 */
export interface ContactChoice {
  /** Value stored in the request. Stable; treat it as an identifier. */
  readonly value: string;
  /** Human readable label. */
  readonly label: string;
}

/**
 * Copy for a single labelled field.
 */
export interface ContactFieldCopy {
  /** Two digit marker rendered beside the label. */
  readonly index: string;
  /** Field label. */
  readonly label: string;
  /** Placeholder shown while the field is empty. */
  readonly placeholder: string;
}

/**
 * Messages surfaced when a field fails validation.
 *
 * They are content, not logic, so they live here and are handed to the
 * validators rather than written inside them — the same rule the rest of the
 * site follows, and what lets the form be validated identically on the server
 * and in another locale.
 */
export interface ContactValidationMessages {
  readonly nameRequired: string;
  readonly emailRequired: string;
  readonly emailInvalid: string;
  readonly projectTypeRequired: string;
  readonly budgetRequired: string;
  readonly messageRequired: string;
  readonly messageTooShort: string;
}

/**
 * One step in the list describing what follows a submission.
 */
export interface ContactStep {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** Two digit marker. */
  readonly index: string;
  /** Step title. */
  readonly title: string;
  /** One line of detail. */
  readonly detail: string;
}

/**
 * Every piece of copy rendered by the contact section.
 */
export interface ContactContent {
  /** Section marker rendered above the heading. */
  readonly eyebrow: string;
  /** Oversized numeral drawn as an outline behind the section. */
  readonly numeral: string;
  /** Heading, split into the lines it should render on. */
  readonly headingLines: readonly string[];
  /** Supporting paragraph beside the heading. */
  readonly lede: string;
  /** Accessible name of the form. */
  readonly formLabel: string;
  /** Copy for each field, keyed by the request property it fills. */
  readonly fields: {
    readonly name: ContactFieldCopy;
    readonly email: ContactFieldCopy;
    readonly company: ContactFieldCopy;
    readonly projectType: ContactFieldCopy;
    readonly budget: ContactFieldCopy;
    readonly message: ContactFieldCopy;
  };
  /** Suffix marking a field the visitor may leave empty. */
  readonly optionalLabel: string;
  /** Options for the project type select. */
  readonly projectTypeChoices: readonly ContactChoice[];
  /** Options for the budget select. */
  readonly budgetChoices: readonly ContactChoice[];
  /** Messages surfaced when a field fails validation. */
  readonly validation: ContactValidationMessages;
  /** Label of the submit control at rest. */
  readonly submitLabel: string;
  /** Label of the submit control while the request is in flight. */
  readonly submittingLabel: string;
  /** Heading of the panel replacing the form once a request is accepted. */
  readonly successTitle: string;
  /** Body of that panel. */
  readonly successBody: string;
  /** Label of the control that returns to an empty form. */
  readonly successResetLabel: string;
  /** Message shown when the request could not be delivered. */
  readonly failureMessage: string;
  /** Heading of the list describing what follows a submission. */
  readonly stepsTitle: string;
  /** The steps themselves. */
  readonly steps: readonly ContactStep[];
  /** Label introducing the direct address. */
  readonly directLabel: string;
  /** Address offered to visitors who would rather not use the form. */
  readonly directEmail: string;
  /** Note about how quickly a reply arrives. */
  readonly responseNote: string;
}

/**
 * Launch copy for the p2s contact section.
 */
export const contactContent: ContactContent = {
  eyebrow: "05 / Contact",
  numeral: "05",
  headingLines: ["TELL US WHAT", "IS BREAKING."],
  lede:
    "No forms that vanish into a shared inbox. This one reaches the people who would do the work, and they are the ones who answer it.",
  formLabel: "Start a project",
  fields: {
    name: { index: "01", label: "Your name", placeholder: "Ada Lovelace" },
    email: { index: "02", label: "Work email", placeholder: "ada@company.com" },
    company: { index: "03", label: "Company", placeholder: "Analytical Engines S.L." },
    projectType: { index: "04", label: "What do you need", placeholder: "Pick the closest fit" },
    budget: { index: "05", label: "Budget range", placeholder: "Select a range" },
    message: {
      index: "06",
      label: "What is the problem",
      placeholder:
        "What is happening today, what it costs you, and what it would look like if it were fixed.",
    },
  },
  optionalLabel: "Optional",
  projectTypeChoices: [
    { value: "software", label: "Custom software" },
    { value: "mobile", label: "Mobile app" },
    { value: "automation", label: "Automation" },
    { value: "process", label: "Process engineering" },
    { value: "ai", label: "AI integration" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "unsure", label: "Not sure yet" },
  ],
  budgetChoices: [
    { value: "under-25k", label: "Under 25.000 €" },
    { value: "25k-60k", label: "25.000 € — 60.000 €" },
    { value: "60k-120k", label: "60.000 € — 120.000 €" },
    { value: "over-120k", label: "Over 120.000 €" },
    { value: "retainer", label: "Ongoing retainer" },
    { value: "undecided", label: "Still working it out" },
  ],
  validation: {
    nameRequired: "We need something to call you.",
    emailRequired: "We cannot reply without an address.",
    emailInvalid: "That address is missing something.",
    projectTypeRequired: "Pick the closest fit — you can be wrong.",
    budgetRequired: "A range is enough. It changes what we propose.",
    messageRequired: "Tell us what is going on.",
    messageTooShort: "A little more — a sentence or two is plenty.",
  },
  submitLabel: "Send it",
  submittingLabel: "Sending",
  successTitle: "GOT IT.",
  successBody:
    "Your message is with us. Expect a reply from a person who read it, usually within one working day.",
  successResetLabel: "Send another",
  failureMessage: "That did not go through. Try again, or email us directly.",
  stepsTitle: "What happens next",
  steps: [
    {
      id: "read",
      index: "01",
      title: "We read it",
      detail: "Not a bot, not an account manager. One of the people who would build it.",
    },
    {
      id: "reply",
      index: "02",
      title: "We reply with questions",
      detail: "Usually the awkward ones. It is the fastest way to find the real problem.",
    },
    {
      id: "scope",
      index: "03",
      title: "We scope it together",
      detail: "A call, then a written plan with a price and a date. No obligation attached.",
    },
  ],
  directLabel: "Or write to us directly",
  directEmail: "admin@push2solutions.es",
  responseNote: "Replies within one working day",
};
