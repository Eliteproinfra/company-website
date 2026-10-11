/**
 * lib/slug.ts — the slug rules three layers have to agree on (proxy.ts,
 * uniqueSlug in lib/db/queries.ts, and the schema.sql repair migration).
 *
 * The regression these lock down is the M3M CFC bug: a slug typed into the
 * admin with a space in it was stored verbatim, reached the browser as %20,
 * matched no route, and 404'd a published listing.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeSlug, slugify } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates a title", () => {
    assert.equal(slugify("Oberoi 360 North Gurgaon"), "oberoi-360-north-gurgaon");
  });

  it("collapses runs of punctuation into a single hyphen", () => {
    assert.equal(slugify("M3M — CFC, Sector 113 / Gurugram"), "m3m-cfc-sector-113-gurugram");
  });

  it("trims leading and trailing hyphens", () => {
    assert.equal(slugify("  --Hello--  "), "hello");
  });

  it("strips diacritics rather than dropping the letter", () => {
    assert.equal(slugify("Café Résidence"), "cafe-residence");
  });

  it("caps length at 180 characters", () => {
    assert.ok(slugify("a".repeat(500)).length <= 180);
  });

  it("returns an empty string when nothing survives", () => {
    assert.equal(slugify("!!! ???"), "");
  });
});

describe("sanitizeSlug", () => {
  it("replaces a space — the whole of the M3M CFC bug", () => {
    assert.equal(sanitizeSlug("M3M-CFC-Sector 113-Gurugram"), "M3M-CFC-Sector-113-Gurugram");
  });

  it("preserves capitalisation, because indexed URLs depend on it", () => {
    // /properties/DLF-The-Aureva-Sector-63-Gurgaon is already live under this
    // exact spelling; lowercasing it here would break the indexed address.
    assert.equal(
      sanitizeSlug("DLF-The-Aureva-Sector-63-Gurgaon"),
      "DLF-The-Aureva-Sector-63-Gurgaon"
    );
  });

  it("leaves an already-clean slug untouched, so the proxy does not redirect-loop", () => {
    // routableSlugPath() in proxy.ts returns null when sanitizeSlug is a no-op.
    // If this ever changed, every detail page would 308 to itself forever.
    for (const slug of ["m3m-paragon-office-space", "DLF-The-Aureva", "abc123"]) {
      assert.equal(sanitizeSlug(slug), slug);
    }
  });

  it("strips characters that cannot appear raw in a path segment", () => {
    assert.equal(sanitizeSlug("a?b#c&d=e"), "a-b-c-d-e");
    assert.equal(sanitizeSlug("a/b"), "a-b");
    assert.equal(sanitizeSlug("a%20b"), "a-20b");
  });

  it("trims hyphens from both ends", () => {
    assert.equal(sanitizeSlug(" -abc- "), "abc");
  });

  it("caps length at 180 characters", () => {
    assert.ok(sanitizeSlug("a".repeat(500)).length <= 180);
  });

  it("is idempotent — a repaired slug repairs to itself", () => {
    const once = sanitizeSlug("M3M CFC / Sector 113");
    assert.equal(sanitizeSlug(once), once);
  });

  it("agrees with the schema.sql repair migration", () => {
    // The migration runs:
    //   TRIM(BOTH '-' FROM REGEXP_REPLACE(slug, '[^A-Za-z0-9]+', '-'))
    // These must produce the same answer, or a deploy's repair would disagree
    // with what uniqueSlug() writes and the rows would flip back and forth.
    const sqlEquivalent = (value: string) =>
      value.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    for (const slug of ["M3M-CFC-Sector 113-Gurugram", "a?b#c", " -x- ", "Already-Fine"]) {
      assert.equal(sanitizeSlug(slug), sqlEquivalent(slug), slug);
    }
  });
});
