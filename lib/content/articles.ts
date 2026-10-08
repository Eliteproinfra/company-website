/**
 * What the PR & Media, Insights & Blogs and News & Updates pages render —
 * SERVER ONLY.
 *
 * Same contract as lib/content/teams.ts and lib/content/properties.ts: the
 * database when it is configured and has rows, the hardcoded
 * lib/data/articles.ts otherwise. The fallback covers an unconfigured
 * `npm run export` build, an unreachable database, and a deploy that has not
 * been seeded yet.
 *
 * All three sections share one table keyed by `kind`, exactly as they share one
 * page component, so this resolves the whole catalogue once and filters in
 * memory rather than issuing a query per section.
 */
import "server-only";
import { cache } from "react";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listArticles, type ArticleRecord } from "@/lib/db/queries";
import { articles as staticArticles, type Article, type ArticleKind } from "@/lib/data/articles";

/**
 * The admin stores a DATE; the pages print it verbatim. Live renders a long
 * date ("12 March 2026"), which is what the static records already hold, so
 * format rather than leaking an ISO string onto the page.
 */
function formatDate(value: string | null): string {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function toArticle(record: ArticleRecord): Article {
  return {
    id: record.id,
    kind: record.kind,
    slug: record.slug,
    title: record.title,
    date: formatDate(record.published_on),
    excerpt: record.excerpt ?? "",
    image: record.image,
    imageWidth: record.image_width,
    imageHeight: record.image_height,
    content: record.content ?? "",
    relatedIds: record.relatedIds,
  };
}

/** Every published article across all three sections, newest first. */
export const getArticles = cache(async (): Promise<Article[]> => {
  if (!isDatabaseConfigured()) return staticArticles;

  try {
    const records = await listArticles();
    // No rows means the seed has not been run, not that there is no coverage.
    if (records.length === 0) return staticArticles;
    return records.map(toArticle);
  } catch (error) {
    console.error("[articles] database unavailable, serving the static catalogue:", error);
    return staticArticles;
  }
});

export async function getArticlesByKind(kind: ArticleKind): Promise<Article[]> {
  return (await getArticles()).filter((article) => article.kind === kind);
}

export async function getArticle(kind: ArticleKind, slug: string): Promise<Article | undefined> {
  return (await getArticles()).find(
    (article) => article.kind === kind && article.slug === slug
  );
}

/** Related articles resolve within their own section, the way the ids are authored. */
export async function getRelatedArticles(article: Article): Promise<Article[]> {
  if (article.relatedIds.length === 0) return [];
  const all = await getArticles();
  const byId = new Map(all.filter((item) => item.kind === article.kind).map((item) => [item.id, item]));
  return article.relatedIds
    .map((id) => byId.get(id))
    .filter((item): item is Article => Boolean(item));
}
