/**
 * Image upload for the admin. Authenticated, allowlisted by real file signature,
 * and written under public/uploads with a generated name.
 *
 * The site this replaces was compromised through an unauthenticated upload
 * endpoint that took the client's filename and extension at face value. Every
 * rule below exists because of that: the session is checked first, the extension
 * comes from sniffed magic bytes rather than the upload, and the stored name is
 * generated so a caller can never choose a path.
 */
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/** Magic-byte signatures. The declared MIME type and filename are ignored. */
function sniffExtension(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "png";
  }
  // GIF87a / GIF89a
  if (buffer.subarray(0, 6).toString("ascii").match(/^GIF8[79]a$/)) return "gif";
  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }
  // AVIF / HEIF: "ftyp" brand at offset 4
  if (buffer.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("ascii");
    if (brand.startsWith("avif") || brand.startsWith("avis")) return "avif";
  }
  return null;
}

/**
 * A correct magic header is not enough. A *polyglot* — a real image with script
 * source appended — passes a header check while still being a payload if the
 * file is ever renamed or served by a PHP-enabled host. The webshell found on
 * this project's own previous host (`1780881274_nax.php`) was exactly that: a
 * valid PDF/JPEG carrying PHP.
 *
 * So the whole buffer is scanned for interpreter markers.
 *
 * Every marker here must be long enough that it cannot plausibly occur inside
 * compressed pixel data. That is not a style rule, it is arithmetic: a marker of
 * n bytes collides at roughly 1/256^n per offset, and an 8 MB upload offers ~8M
 * offsets. Two- and three-byte markers are therefore near-certain false
 * positives, and `<%` and `<?=` used to be on this list — measured against 400
 * of this site's own photographs, `<%` matched 317 of them (79%) and `<?=`
 * matched 40 (10%), so most legitimate uploads were refused. Every marker below
 * matched zero. Keep the five-byte floor when adding to this list.
 *
 * Dropping those two costs little in practice: nothing on this host interprets
 * ASP or PHP. nginx serves /uploads/ as static bytes with `X-Content-Type-
 * Options: nosniff` (deploy/nginx-production.conf), the stored extension comes
 * from sniffed magic bytes, and the filename is generated. This scan is
 * defence-in-depth behind those controls, not the control itself.
 */
const PAYLOAD_MARKERS = [
  "<?php",
  "<script",
  "system(",
  "shell_exec",
  "base64_decode",
  "eval(",
  "passthru(",
  "proc_open(",
];

function containsExecutablePayload(buffer: Buffer): string | null {
  // latin1 maps bytes 1:1 to characters, so a marker cannot hide across a
  // multi-byte decode boundary the way it could with utf8.
  const text = buffer.toString("latin1").toLowerCase();
  for (const marker of PAYLOAD_MARKERS) {
    if (text.includes(marker)) return marker;
  }
  return null;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Malformed upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = sniffExtension(buffer);
  if (!extension) {
    // Anything that is not a recognised image is rejected outright — this is
    // what stops a .php (or a polyglot PDF/JPEG dropper) being written to disk.
    return NextResponse.json(
      { error: "Unsupported file type. Upload a JPEG, PNG, GIF, WebP or AVIF image." },
      { status: 415 }
    );
  }

  const marker = containsExecutablePayload(buffer);
  if (marker) {
    return NextResponse.json(
      {
        error:
          "This file has a valid image header but contains embedded code, so it was rejected. Re-save it from an image editor and try again.",
      },
      { status: 415 }
    );
  }

  // Name is generated, never derived from the upload: no traversal, no
  // collisions, no attacker-chosen extension.
  const now = new Date();
  const folder = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const filename = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(
    now.getUTCDate()
  ).padStart(2, "0")}-${randomBytes(8).toString("hex")}.${extension}`;

  const targetDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
