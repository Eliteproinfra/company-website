import { NextResponse } from "next/server";
import { captureEnquiry } from "@/lib/enquiries";
import { sendMail, escapeHtml } from "@/lib/mailer";

type EnquiryBody = {
  source?: string;
  fields?: Record<string, string>;
  honeypot?: string;
};

export async function POST(request: Request) {
  // An unparseable body used to throw out of here as a 500 with a stack trace. It is a bad
  // request, not a server fault, and scanners post junk to this path all day.
  let body: EnquiryBody | null;
  try {
    body = (await request.json()) as EnquiryBody | null;
  } catch {
    return NextResponse.json({ error: "Could not read your submission." }, { status: 400 });
  }

  const { source, fields, honeypot } = body ?? {};

  if (honeypot) {
    // Bot filled in a field that's hidden from real users — silently pretend success.
    return NextResponse.json({ ok: true });
  }

  const entries = Object.entries(fields ?? {}).filter(([, value]) => value && String(value).trim());
  // A backstop for an empty post only. Each form marks its own inputs `required`, and the
  // count varies by form — the land-acquisition CTA legitimately sends a phone number and
  // nothing else — so anything stricter here rejects valid leads.
  if (entries.length === 0) {
    return NextResponse.json({ error: "Please fill in the required fields." }, { status: 400 });
  }

  // The forms cap a message at 500 words; 5,000 characters is comfortably above that in any
  // language and still keeps a scripted post from filling the Enquiries inbox with an essay.
  if (entries.some(([, value]) => String(value).length > 5000)) {
    return NextResponse.json({ error: "Your message is too long. Please shorten it and try again." }, { status: 400 });
  }

  const emailEntry = entries.find(([key]) => key.toLowerCase().includes("email"));
  const nameEntry = entries.find(([key]) => key.toLowerCase().includes("name"));

  const html = `
    <h2>New website enquiry${source ? ` — ${escapeHtml(source)}` : ""}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${entries
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:bold;vertical-align:top">${escapeHtml(label)}</td><td>${escapeHtml(
              String(value)
            ).replace(/\n/g, "<br/>")}</td></tr>`
        )
        .join("")}
    </table>
  `;

  // Stored before the email is attempted, so an SMTP outage cannot lose the lead.
  const { stored } = await captureEnquiry(source ?? "", entries as [string, string][]);

  try {
    await sendMail({
      subject: `New enquiry${source ? ` — ${source}` : ""} from ${nameEntry?.[1] ?? "website visitor"}`,
      html,
      replyTo: emailEntry?.[1],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send enquiry email:", error);
    // The lead is safely in the admin's Enquiries inbox even though the
    // notification did not go out, so asking the visitor to submit again would
    // only create duplicates. Only a submission that reached neither is an error.
    if (stored) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Could not send your enquiry. Please try again shortly." }, { status: 500 });
  }
}
