/**
 * Slug rules, in one place because three layers have to agree on them.
 *
 * Deliberately standalone and dependency-free: proxy.ts imports this, and the
 * proxy runs outside the render path, so anything it pulls in has to be cheap
 * and free of server-only modules. That is also why these do not live in
 * lib/db/sanitize.ts any more — that file is the HTML allowlist, and dragging
 * it into the proxy bundle would be the wrong trade.
 */

/** URL-safe slug from a title. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

/**
 * Makes a slug somebody typed safe to put in a URL path.
 *
 * {@link slugify} derives a slug from a title and owns the house style for one;
 * this one repairs a slug the admin supplied, so it changes as little as it can.
 * Capitalisation is kept — /properties/DLF-The-Aureva-Sector-63-Gurgaon is
 * already live and indexed under that spelling — and only characters that
 * cannot appear raw in a path segment are replaced.
 *
 * A space was the whole of the M3M CFC bug: typed into the slug field it
 * reached the browser as %20, which matches no route, so the listing 404'd.
 */
export function sanitizeSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}
