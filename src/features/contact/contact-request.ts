import type { ContactValidationMessages } from "@/content/contact-content";

/**
 * Everything a visitor sends through the contact form.
 *
 * Every property is a string, including the two selects: the form serialises a
 * choice to its stable `value`, never to its label, so the copy can change
 * without invalidating anything already received.
 */
export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  /** May be empty. The only field a visitor is allowed to skip. */
  readonly company: string;
  readonly projectType: string;
  readonly budget: string;
  readonly message: string;
}

/**
 * Validation failures, keyed by the field that produced them.
 *
 * A field with no entry passed. An empty object means the whole request is
 * deliverable.
 */
export type ContactFieldErrors = Partial<Record<keyof ContactRequest, string>>;

/**
 * Outcome of an attempt to deliver a request.
 *
 * Declared here rather than beside the transport so the form can depend on the
 * shape of an answer without depending on who produces it.
 */
export interface ContactSubmissionResult {
  /** Whether the request was accepted and dispatched. */
  readonly ok: boolean;
  /** Failures found while re-validating on the server, if any. */
  readonly fieldErrors?: ContactFieldErrors;
}

const MINIMUM_NAME_LENGTH = 2;
const MINIMUM_MESSAGE_LENGTH = 24;

/**
 * Shape an address has to have before it is worth attempting delivery.
 *
 * Deliberately permissive. The only address format that can be fully validated
 * is one that has already accepted mail, so anything stricter than "a local
 * part, an at sign, and a dotted domain" rejects real addresses — quoted local
 * parts, new top level domains, plus addressing — for no gain.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates the visitor's name.
 *
 * @param value - The submitted value.
 * @param messages - Copy to draw the failure message from.
 * @returns The failure message, or `undefined` when the value passes.
 */
export function validateName(
  value: string,
  messages: ContactValidationMessages,
): string | undefined {
  return value.trim().length >= MINIMUM_NAME_LENGTH ? undefined : messages.nameRequired;
}

/**
 * Validates the reply address.
 *
 * @param value - The submitted value.
 * @param messages - Copy to draw the failure message from.
 * @returns The failure message, or `undefined` when the value passes.
 */
export function validateEmail(
  value: string,
  messages: ContactValidationMessages,
): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return messages.emailRequired;
  }

  return EMAIL_PATTERN.test(trimmed) ? undefined : messages.emailInvalid;
}

/**
 * Validates a value coming from one of the selects.
 *
 * @param value - The chosen option's value, or an empty string.
 * @param message - Copy to return when nothing was chosen.
 * @returns The failure message, or `undefined` when a choice was made.
 */
export function validateChoice(value: string, message: string): string | undefined {
  return value.length > 0 ? undefined : message;
}

/**
 * Validates the body of the request.
 *
 * @param value - The submitted value.
 * @param messages - Copy to draw the failure message from.
 * @returns The failure message, or `undefined` when the value passes.
 */
export function validateMessage(
  value: string,
  messages: ContactValidationMessages,
): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return messages.messageRequired;
  }

  return trimmed.length >= MINIMUM_MESSAGE_LENGTH ? undefined : messages.messageTooShort;
}

/**
 * Validates a whole request.
 *
 * The form runs the rules above field by field as the visitor works; this runs
 * all of them at once and is what the server uses, because a request that
 * arrives over the network never went through the form's copy of the rules and
 * cannot be assumed to have passed them.
 *
 * @param request - The request to check.
 * @param messages - Copy to draw failure messages from.
 * @returns Failures keyed by field. Empty when the request is deliverable.
 */
export function validateContactRequest(
  request: ContactRequest,
  messages: ContactValidationMessages,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {
    name: validateName(request.name, messages),
    email: validateEmail(request.email, messages),
    projectType: validateChoice(request.projectType, messages.projectTypeRequired),
    budget: validateChoice(request.budget, messages.budgetRequired),
    message: validateMessage(request.message, messages),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, failure]) => failure !== undefined),
  ) as ContactFieldErrors;
}
