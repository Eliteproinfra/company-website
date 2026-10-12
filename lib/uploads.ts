/**
 * Where admin-uploaded images live on disk, and the extensions we accept.
 *
 * Shared by the two halves of the upload path: app/api/admin/upload writes
 * here, app/uploads/[...path] reads back out of it.
 */
import path from "node:path";

/**
 * Deliberately NOT written as a literal `path.join(process.cwd(), "public",
 * "uploads", …)`. Turbopack folds that into a directory asset reference and
 * traces every file already under public/uploads into the importing route's
 * build output. In production that directory is a symlink to
 * `/var/www/eliteproinfra/shared/uploads`, which lives outside the release
 * directory Turbopack treats as the filesystem root, so the build fails with
 * "Symlink … is invalid, it points out of the filesystem root" — see
 * deploy/AWS.md for why uploads are shared rather than per-release. The failure
 * only appears once something has actually been uploaded, which is why it lay
 * dormant until the first admin upload.
 *
 * Splitting the relative path at runtime keeps the value opaque to that static
 * analysis. UPLOADS_DIR overrides it outright if the shared directory ever
 * stops being symlinked into the release.
 */
export function uploadsRoot(): string {
  // turbopackIgnore stops the build treating this as a directory to bundle.
  // Without it Turbopack resolves the path and walks everything already under
  // public/uploads, which in production is a symlink to shared/uploads
  // (deploy/AWS.md) — outside the release directory it treats as the filesystem
  // root — and the build fails with "points out of the filesystem root". This
  // directory is runtime state, never build input, so tracing it is always wrong.
  return (
    process.env.UPLOADS_DIR ||
    path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads")
  );
}

/**
 * The extensions the upload route is able to produce, mapped to the type they
 * are served back as. An upload's extension comes from sniffed magic bytes, so
 * this table is the complete set — anything else under the uploads directory
 * did not come from this application and is not served.
 */
export const UPLOAD_CONTENT_TYPES: Readonly<Record<string, string>> = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
};

/**
 * Every brand an ISO-BMFF `ftyp` box declares: the major brand, then the
 * compatible-brands list that follows it.
 *
 * Reading only the major brand is not enough. The box is
 * `size | 'ftyp' | major | minor_version | compatible_brands[]`, and an encoder
 * is free to put a generic major brand in front of the specific one — `mif1`
 * with `avif` in the compatible list is ordinary AVIF output, and checking
 * bytes 8-12 alone rejected it as an unknown format.
 */
function ftypBrands(buffer: Buffer): string[] {
  if (buffer.length < 16) return [];
  if (buffer.subarray(4, 8).toString("ascii") !== "ftyp") return [];

  // A ftyp box is tens of bytes. Clamping stops a bogus size sending this
  // through megabytes of pixel data looking for four-character codes.
  const declared = buffer.readUInt32BE(0);
  const end = Math.min(declared >= 16 ? declared : 16, buffer.length, 1024);

  const brands = [buffer.subarray(8, 12).toString("ascii")];
  for (let offset = 16; offset + 4 <= end; offset += 4) {
    brands.push(buffer.subarray(offset, offset + 4).toString("ascii"));
  }
  return brands.map((brand) => brand.toLowerCase().trim());
}

function declaresAvif(brands: string[]): boolean {
  return brands.some((brand) => brand.startsWith("avif") || brand.startsWith("avis"));
}

/**
 * HEIC/HEIF brands — what an iPhone shoots unless it has been set to "Most
 * Compatible". These are deliberately NOT accepted (see the upload route's 415
 * for why), but they are recognised so the refusal can say what the file is
 * instead of calling a perfectly good photo an unsupported type.
 */
const HEIF_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heim",
  "heis",
  "hevm",
  "hevs",
  "mif1",
  "msf1",
]);

/** True for a HEIC/HEIF photo — used only to choose the refusal message. */
export function isHeif(buffer: Buffer): boolean {
  const brands = ftypBrands(buffer);
  // An AVIF commonly carries mif1 in its compatible list too, so anything
  // declaring avif is AVIF and was already accepted by sniffExtension.
  if (declaresAvif(brands)) return false;
  return brands.some((brand) => HEIF_BRANDS.has(brand));
}

/**
 * The stored extension for an upload, read from its magic bytes. The declared
 * MIME type and the client's filename are ignored — they are attacker input.
 *
 * Every extension returned here needs an entry in UPLOAD_CONTENT_TYPES above,
 * or app/uploads/[...path] will refuse to serve what the upload route wrote.
 */
export function sniffExtension(buffer: Buffer): string | null {
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
  // AVIF: an ISO-BMFF container declaring the avif/avis brand anywhere.
  if (declaresAvif(ftypBrands(buffer))) return "avif";

  return null;
}
