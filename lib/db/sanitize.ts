/**
 * Allowlist sanitiser for CMS-authored HTML.
 *
 * Article bodies are rendered with dangerouslySetInnerHTML, so anything stored
 * here executes in every visitor's browser. The previous host was compromised by
 * an arbitrary-file-upload webshell, and injecting <script> beacons and hidden
 * link farms into exactly this kind of column is that malware's standard payload
 * — so content is sanitised on the way IN, and the stored value is the clean one.
 *
 * Allowlist, never blocklist: unknown tags are dropped rather than hunted for.
 */

/** Formatting tags an editor legitimately needs. No <script>, <iframe>, <form>,
 *  <object>, <embed>, <style>, and no event handlers anywhere. */
const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "sub", "sup",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "code",
  "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  "span", "div",
]);

/** Attributes allowed per tag. `style` is absent everywhere: it is how injected
 *  spam hides itself (display:none, off-screen positioning, zero font-size). */
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
};

/** Only these URL schemes may appear in href/src. Blocks javascript:, data:
 *  (an XSS vector via data:text/html) and vbscript:. */
const SAFE_URL = /^(https?:\/\/|\/|#|mailto:|tel:)/i;

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  // Strip control characters first — `java\0script:` and friends.
  const cleaned = trimmed.replace(/[\u0000-\u001f\u007f]/g, "");
  if (!SAFE_URL.test(cleaned)) return false;
  if (/^\s*javascript:/i.test(cleaned)) return false;
  return true;
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeAttributes(tag: string, raw: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return "";

  const out: string[] = [];
  // name="value" | name='value' | name=value
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase();
    const value = m[3] ?? m[4] ?? m[5] ?? "";
    if (!allowed.has(name)) continue;
    if ((name === "href" || name === "src") && !isSafeUrl(value)) continue;

    const safeValue = value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    out.push(`${name}="${safeValue}"`);
  }

  // Anything leaving the site opens in a new tab and must not hand over
  // window.opener — and a rel of noopener/noreferrer also blunts link-farm SEO
  // value if something does slip through.
  if (tag === "a") {
    const href = out.find((a) => a.startsWith('href="'));
    if (href && /^href="https?:\/\//i.test(href)) {
      const hasTarget = out.some((a) => a.startsWith('target="'));
      if (!hasTarget) out.push('target="_blank"');
      const relIndex = out.findIndex((a) => a.startsWith('rel="'));
      if (relIndex >= 0) out.splice(relIndex, 1);
      out.push('rel="noopener noreferrer"');
    }
  }

  return out.length ? ` ${out.join(" ")}` : "";
}

const VOID_TAGS = new Set(["br", "hr", "img"]);

/**
 * Returns HTML containing only allowlisted tags and attributes. Disallowed tags
 * are removed along with the contents of executable ones (script/style), while
 * ordinary unknown tags are unwrapped so their text survives.
 */
export function sanitizeArticleHtml(input: string | null | undefined): string {
  if (!input) return "";

  // Drop executable/embedded blocks and their contents outright — unwrapping
  // these would leak raw JS or CSS as visible text.
  let html = input.replace(
    /<(script|style|iframe|object|embed|noscript|template|form)\b[\s\S]*?<\/\1\s*>/gi,
    ""
  );
  // ...including unclosed ones.
  html = html.replace(/<(script|style|iframe|object|embed|noscript|template|form)\b[^>]*>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  const openStack: string[] = [];
  let out = "";
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = tagRe.exec(html))) {
    out += escapeText(html.slice(lastIndex, m.index));
    lastIndex = tagRe.lastIndex;

    const tag = m[1].toLowerCase();
    const isClosing = m[0].startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) continue; // unwrap: keep inner text, drop the tag

    if (isClosing) {
      const idx = openStack.lastIndexOf(tag);
      if (idx === -1) continue; // stray close
      // Close anything left open inside it, so output stays well-formed.
      while (openStack.length > idx) {
        out += `</${openStack.pop()}>`;
      }
    } else if (VOID_TAGS.has(tag)) {
      out += `<${tag}${sanitizeAttributes(tag, m[2] ?? "")}/>`;
    } else {
      out += `<${tag}${sanitizeAttributes(tag, m[2] ?? "")}>`;
      openStack.push(tag);
    }
  }

  out += escapeText(html.slice(lastIndex));
  while (openStack.length) out += `</${openStack.pop()}>`;

  return out.trim();
}

/** Collapses HTML to plain text — used for excerpts and list previews. */
export function htmlToText(input: string | null | undefined, maxLength = 0): string {
  if (!input) return "";
  let text = input
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/\s+/g, " ")
    .trim();
  if (maxLength > 0 && text.length > maxLength) {
    text = `${text.slice(0, maxLength).trimEnd()}…`;
  }
  return text;
}

/** URL-safe slug from a title. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}
