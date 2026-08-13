import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally SMTP_SECURE, SMTP_TO) in .env.local."
    );
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

export async function sendMail(options: {
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}) {
  const to = process.env.SMTP_TO || process.env.SMTP_USER;
  await getTransporter().sendMail({
    from: `"Elite Pro Infra Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  });
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
