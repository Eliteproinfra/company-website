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

    // Bounded, and deliberately well inside nginx's proxy_read_timeout of 120s
    // (deploy/nginx-aws.conf). Without these nodemailer waits on its own
    // defaults, and a Gmail connection that opens but never answers held the
    // request until nginx gave up first — so the visitor got nginx's HTML 504
    // rather than the route's own reply, even though captureEnquiry had already
    // stored the lead and the route was about to return ok. The three stages
    // are separate timers, so the worst case is their sum: 10 + 10 + 20 = 40s,
    // leaving room for the rest of the request.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
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
