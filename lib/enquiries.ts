/**
 * Captures a public form submission into the `enquiries` table — SERVER ONLY.
 *
 * Both public forms (/api/enquiry and /api/career-application) only emailed,
 * which is why the admin's Enquiries page has always been empty. The point of
 * storing, per the schema comment on that table, is that a lead survives an
 * SMTP outage — so storing is attempted first and a failure to store never
 * stops the email going out.
 *
 * Never throws: a lead is worth more than a clean stack trace, and the caller
 * decides what to tell the visitor based on whether *anything* worked.
 */
import "server-only";
import { isDatabaseConfigured } from "@/lib/db/client";
import { createEnquiry } from "@/lib/db/queries";

/** Matched case-insensitively against the form's own field labels, which vary
 *  per form ("Full Name", "Your Email", "Contact Number", …). */
const COLUMN_PATTERNS: { column: "name" | "email" | "phone" | "message"; test: RegExp }[] = [
  { column: "email", test: /e-?mail/i },
  { column: "phone", test: /phone|mobile|contact\s*(no|number)/i },
  { column: "name", test: /name/i },
  { column: "message", test: /message|comment|requirement|enquiry|query/i },
];

export type CapturedEnquiry = { stored: boolean };

export async function captureEnquiry(
  source: string,
  fields: [string, string][]
): Promise<CapturedEnquiry> {
  if (!isDatabaseConfigured()) return { stored: false };

  const picked: Record<string, string> = {};
  const extra: Record<string, string> = {};

  for (const [label, value] of fields) {
    // First pattern wins, and a column is only filled once: a form carrying both
    // "Name" and "Company Name" must not have the second overwrite the first.
    const match = COLUMN_PATTERNS.find(({ column, test }) => test.test(label) && !picked[column]);
    if (match) picked[match.column] = value;
    else extra[label] = value;
  }

  try {
    await createEnquiry({
      source,
      name: picked.name ?? "",
      email: picked.email ?? "",
      phone: picked.phone ?? "",
      message: picked.message ?? "",
      extra,
    });
    return { stored: true };
  } catch (error) {
    console.error(`[enquiry] could not store a "${source}" lead, sending it anyway:`, error);
    return { stored: false };
  }
}
