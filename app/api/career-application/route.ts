import { NextResponse } from "next/server";
import { captureEnquiry } from "@/lib/enquiries";
import { sendMail, escapeHtml } from "@/lib/mailer";
import {
  MAX_FIELD_LENGTH,
  MAX_LINE_LENGTH,
  formString,
  looksLikeEmail,
} from "@/lib/forms/validate";

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_RESUME_EXTENSIONS = ["pdf", "doc", "docx"] as const;

const ALLOWED_RESUME_TYPES: Record<string, (typeof ALLOWED_RESUME_EXTENSIONS)[number]> = {
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
  // Checked before the body is read, so an oversized post is refused without
  // first buffering it into memory. nginx's client_max_body_size is the real
  // ceiling; this makes the app's own answer readable when it is reached
  // through something that has no such limit.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_RESUME_SIZE + 1024 * 1024) {
    return NextResponse.json({ error: "Resume must be smaller than 5MB." }, { status: 413 });
  }

  // An unparseable multipart body used to throw out of here as a 500 with a
  // stack trace — the same bug /api/enquiry fixed for its JSON parse. Scanners
  // post junk to both paths; a malformed body is a bad request, not a fault.
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read your application." }, { status: 400 });
  }

  const honeypot = formString(formData, "company-website");
  if (honeypot) {
    // Bot filled in a field that's hidden from real users — silently pretend success.
    return NextResponse.json({ ok: true });
  }

  const name = formString(formData, "name");
  const phone = formString(formData, "phone");
  const email = formString(formData, "email");
  const coverLetter = formString(formData, "coverLetter");
  const resume = formData.get("resume");

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "Name, phone, and email are required." }, { status: 400 });
  }
  if (name.length > MAX_LINE_LENGTH || phone.length > MAX_LINE_LENGTH) {
    return NextResponse.json({ error: "Name or phone number is too long." }, { status: 400 });
  }
  if (!looksLikeEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (coverLetter.length > MAX_FIELD_LENGTH) {
    return NextResponse.json(
      { error: "Your cover letter is too long. Please shorten it and try again." },
      { status: 400 }
    );
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
  }
  if (resume.size > MAX_RESUME_SIZE) {
    return NextResponse.json({ error: "Resume must be smaller than 5MB." }, { status: 413 });
  }

  // BOTH the declared MIME type and the extension have to be acceptable, and
  // they have to agree. This used to be `if (!isAllowedType && !isAllowedExt)`,
  // which passes when *either* one is right — so anything at all renamed to
  // .pdf was accepted and forwarded to HR as an attachment, whatever it really
  // was. Neither signal is trustworthy on its own (both come from the client),
  // but requiring them to match removes the trivial rename.
  const extension = resume.name.split(".").pop()?.toLowerCase() ?? "";
  const typeExtension = ALLOWED_RESUME_TYPES[resume.type];
  const extensionAllowed = (ALLOWED_RESUME_EXTENSIONS as readonly string[]).includes(extension);

  // An empty resume.type is normal — some browsers send nothing for .doc — so
  // it falls back to the extension rather than being treated as a mismatch.
  const typeOk = resume.type ? typeExtension !== undefined : true;
  const agree =
    !resume.type ||
    typeExtension === extension ||
    // .docx files are sometimes declared as the generic Office type by older
    // clients; doc/docx are the same family and HR opens both.
    (typeExtension === "doc" && extension === "docx") ||
    (typeExtension === "docx" && extension === "doc");

  if (!extensionAllowed || !typeOk || !agree) {
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

  // Stored before the email is attempted, so an SMTP outage cannot lose the
  // applicant. The resume itself is an attachment and is not stored.
  const { stored } = await captureEnquiry("Career application", [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ...(coverLetter ? [["Cover Letter", coverLetter] as [string, string]] : []),
    ["Resume", resume.name],
  ]);

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
    // Already in the admin inbox — resubmitting would only duplicate it.
    if (stored) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { error: "Could not submit your application. Please try again shortly." },
      { status: 500 }
    );
  }
}
