/**
 * Shared article-kind constants.
 *
 * Deliberately NOT in actions.ts: a "use server" module may only export async
 * functions, so plain constants and sync helpers have to live in their own file.
 */
import type { ArticleKind } from "@/lib/db/queries";

export const KINDS: ArticleKind[] = ["press", "blog", "news"];

/** Public route each kind is listed under — used for revalidation and preview links. */
export const KIND_BASE: Record<ArticleKind, string> = {
  press: "/media-press",
  blog: "/insights-blog",
  news: "/news-updates",
};

export const KIND_LABEL: Record<ArticleKind, string> = {
  press: "PR & Media",
  blog: "Insights & Blogs",
  news: "News & Updates",
};

export function normalizeKind(value: unknown): ArticleKind {
  return KINDS.includes(value as ArticleKind) ? (value as ArticleKind) : "press";
}
