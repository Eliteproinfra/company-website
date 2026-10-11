/**
 * Server-side validation shared by the two public form routes.
 *
 * Pure and dependency-free, so it is safe to import from a route handler, a
 * Server Action or a client component alike. The caps live here rather than in
 * each route so /api/enquiry and /api/career-application cannot drift apart —
 * they already had: one capped its text fields at 5,000 characters and guarded
 * its body parse, the other did neither.
 */

/** Longest a single free-text field may be. Above the forms' own 500-word cap
 *  in any language, and still short enough that a scripted post cannot fill the
 *  Enquiries inbox with an essay. */
export const MAX_FIELD_LENGTH = 5000;

/** Longest a single-line field (name, phone, subject fragment) may be. */
export const MAX_LINE_LENGTH = 200;

/** The `source` column is VARCHAR(120); the mail subject uses the same cap so
 *  the stored row and the notification agree. */
export const MAX_SOURCE_LENGTH = 120;

/**
 * Deliberately permissive. This rejects obvious junk — no "@", no dot in the
 * domain, whitespace, absurd length — and does not try to decide whether a real
 * mailbox exists. On a lead-capture form a wrongly rejected customer costs far
 * more than a bounced notification, so anything plausible passes.
 */
export function looksLikeEmail(value: string): boolean {
  if (!value || value.length > 190) return false;
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

/** FormData field as a trimmed string — never an object, never a File. */
export function formString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}
