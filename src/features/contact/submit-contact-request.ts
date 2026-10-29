"use server";

import { contactContent } from "@/content/contact-content";

import {
  validateContactRequest,
  type ContactRequest,
  type ContactSubmissionResult,
} from "./contact-request";

/**
 * Environment variable naming where accepted requests are posted.
 *
 * Left deliberately generic: every inbox, CRM and automation platform in use
 * accepts a JSON webhook, and binding the site to one vendor's SDK to save a
 * single `fetch` would be a poor trade.
 */
const ENDPOINT_KEY = "CONTACT_WEBHOOK_URL";

/**
 * Seconds to wait for the endpoint before giving up.
 *
 * A visitor staring at a spinner is worse than a visitor being told to email us,
 * and the form offers a direct address in its failure state.
 */
const TIMEOUT_MS = 8000;

/**
 * Accepts a contact request and dispatches it.
 *
 * Validation runs here again in full. The form's copy of the rules exists to
 * answer the visitor without a round trip; this one decides whether the request
 * is real, because anything arriving over the network may never have been near
 * the form.
 *
 * **This does not deliver anything until `CONTACT_WEBHOOK_URL` is set.** It
 * reports failure rather than success in that case, on purpose: a form that
 * silently swallows messages while thanking people for sending them is worse
 * than one that is visibly not wired up yet.
 *
 * @param request - The request as submitted.
 * @returns Whether the request was dispatched, and any server-side failures.
 */
export async function submitContactRequest(
  request: ContactRequest,
): Promise<ContactSubmissionResult> {
  const fieldErrors = validateContactRequest(request, contactContent.validation);

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  const endpoint = process.env[ENDPOINT_KEY];

  if (endpoint === undefined || endpoint.length === 0) {
    console.error(`[contact] ${ENDPOINT_KEY} is not set; the request was not delivered.`);
    return { ok: false };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        name: request.name.trim(),
        email: request.email.trim(),
        company: request.company.trim(),
        projectType: request.projectType,
        budget: request.budget,
        message: request.message.trim(),
        receivedAt: new Date().toISOString(),
      }),
    });

    return { ok: response.ok };
  } catch (cause) {
    console.error("[contact] delivery failed", cause);
    return { ok: false };
  }
}
