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
