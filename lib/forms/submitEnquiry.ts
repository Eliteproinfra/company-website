/**
 * The one way the public forms post a lead — CLIENT-SAFE (no server imports).
 *
 * Nine forms (contact, homepage, the timed popup, property detail, the service
 * and property-management CTAs, the NRI callback, the footer newsletter and the
 * careers modal) each used to inline this:
 *
 *     if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
 *
 * which has a bug that only shows up when something in front of Next.js answers
 * instead of the route. `res.json()` on an HTML body throws a SyntaxError, and
 * because the call sits inside the form's own try/catch that SyntaxError became
 * the message shown to the visitor — a real submission failing with
 * "Unexpected token '<', \"<html>\"... is not valid JSON" in the error slot.
 *
 * Every non-JSON answer is a real production case, not a hypothetical:
 *   - 429 from nginx's limit_req (deploy/nginx-ratelimit.conf) — an HTML page
 *   - 413 from client_max_body_size — an HTML page
 *   - 502/504 while the Node process restarts mid-deploy — an HTML page
 *   - an offline client — fetch() rejects before there is a response at all
 *
 * So the body is parsed defensively and the status is translated into something
 * a visitor can act on. 429 in particular has to say "wait" rather than "try
 * again", which is the one message that would make the rate limit worse.
 */

/** What /api/enquiry and /api/career-application return on success or failure. */
type ApiPayload = { ok?: boolean; error?: string };

export const GENERIC_SUBMIT_ERROR = "Something went wrong. Please try again.";

/** Reads `{ error }` out of a response that may not be JSON at all. */
async function errorFromResponse(res: Response): Promise<string> {
  // Status first: these are worth a specific message whatever the body holds,
  // and for them the body is nginx's HTML rather than ours.
  if (res.status === 429) {
    return "Too many submissions from this connection. Please wait a minute and try again.";
  }
  if (res.status === 413) {
    return "That file is too large. Please attach a smaller one.";
  }
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    return "The site is briefly unavailable. Please try again in a moment.";
  }

  try {
    const payload = (await res.json()) as ApiPayload | null;
    // Only a non-empty string is usable — `{}` and `{ error: null }` must fall
    // through to the generic message rather than render "null".
    if (payload && typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Not JSON. Nothing to recover; fall through.
  }

  return GENERIC_SUBMIT_ERROR;
}

/**
 * Posts a lead and resolves only when it was accepted; rejects with an Error
 * whose message is safe to show the visitor as-is.
 *
 * Callers keep their own `status` state and `catch` — this replaces the fetch
 * and the response check, not the form's UI.
 */
export async function submitEnquiry(body: {
  source: string;
  fields: Record<string, string | null | undefined>;
  honeypot?: string;
}): Promise<void> {
  let res: Response;
  try {
    res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // fetch() rejects only on a network-level failure, which is not the same
    // thing as the server saying no — and "check your connection" is the one
    // piece of advice that actually helps here.
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  if (!res.ok) throw new Error(await errorFromResponse(res));
}

/**
 * The same contract for a multipart POST — the careers form, which sends a
 * resume file and therefore cannot use the JSON path above.
 */
export async function submitFormData(path: string, formData: FormData): Promise<void> {
  let res: Response;
  try {
    res = await fetch(path, { method: "POST", body: formData });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  if (!res.ok) throw new Error(await errorFromResponse(res));
}

/** Shared by both helpers' callers: turns a caught unknown into a message. */
export function submitErrorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : GENERIC_SUBMIT_ERROR;
}
