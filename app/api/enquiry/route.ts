import { NextResponse } from "next/server";
import { sendMail, escapeHtml } from "@/lib/mailer";

export async function POST(request: Request) {
  const body = await request.json();
  const { source, fields, honeypot } = body as {
    source?: string;
    fields?: Record<string, string>;
    honeypot?: string;
  };

  if (honeypot) {
    // Bot filled in a field that's hidden from real users — silently pretend success.
    return NextResponse.json({ ok: true });
  }

  const entries = Object.entries(fields ?? {}).filter(([, value]) => value && String(value).trim());
  if (entries.length < 2) {
    return NextResponse.json({ error: "Please fill in the required fields." }, { status: 400 });
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

  try {
    await sendMail({
      subject: `New enquiry${source ? ` — ${source}` : ""} from ${nameEntry?.[1] ?? "website visitor"}`,
      html,
      replyTo: emailEntry?.[1],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send enquiry email:", error);
    return NextResponse.json({ error: "Could not send your enquiry. Please try again shortly." }, { status: 500 });
  }
}
