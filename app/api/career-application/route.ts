import { NextResponse } from "next/server";
import { sendMail, escapeHtml } from "@/lib/mailer";

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_RESUME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

function sanitizeFilename(name: string) {
  // Strip any path components and anything that isn't a safe filename character.
  const base = name.split(/[/\\]/).pop() ?? "resume";
  return base.replace(/[^a-zA-Z0-9 ._-]/g, "_").slice(0, 150) || "resume";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name") as string | null;
  const phone = formData.get("phone") as string | null;
  const email = formData.get("email") as string | null;
  const coverLetter = formData.get("coverLetter") as string | null;
  const resume = formData.get("resume") as File | null;
  const honeypot = formData.get("company-website") as string | null;

  if (honeypot) {
    // Bot filled in a field that's hidden from real users — silently pretend success.
    return NextResponse.json({ ok: true });
  }

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "Name, phone, and email are required." }, { status: 400 });
  }
  if (!resume || resume.size === 0) {
    return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
  }
  if (resume.size > MAX_RESUME_SIZE) {
    return NextResponse.json({ error: "Resume must be smaller than 5MB." }, { status: 400 });
  }
  const extFromName = resume.name.split(".").pop()?.toLowerCase();
  const isAllowedType = ALLOWED_RESUME_TYPES[resume.type] !== undefined;
  const isAllowedExt = extFromName ? ["pdf", "doc", "docx"].includes(extFromName) : false;
  if (!isAllowedType && !isAllowedExt) {
    return NextResponse.json(
      { error: "Resume must be a PDF, DOC, or DOCX file." },
      { status: 400 }
    );
  }

  const html = `
    <h2>New career application</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td style="font-weight:bold;vertical-align:top">Name</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="font-weight:bold;vertical-align:top">Phone</td><td>${escapeHtml(phone)}</td></tr>
      <tr><td style="font-weight:bold;vertical-align:top">Email</td><td>${escapeHtml(email)}</td></tr>
      ${
        coverLetter
          ? `<tr><td style="font-weight:bold;vertical-align:top">Cover Letter</td><td>${escapeHtml(
              coverLetter
            ).replace(/\n/g, "<br/>")}</td></tr>`
          : ""
      }
    </table>
  `;

  try {
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    await sendMail({
      subject: `New career application from ${name}`,
      html,
      replyTo: email,
      attachments: [
        {
          filename: sanitizeFilename(resume.name),
          content: resumeBuffer,
          contentType: resume.type || "application/octet-stream",
        },
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send career application email:", error);
    return NextResponse.json(
      { error: "Could not submit your application. Please try again shortly." },
      { status: 500 }
    );
  }
}
