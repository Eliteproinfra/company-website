/**
 * The homepage "Insights Hub" tabs — SERVER ONLY.
 *
 * One tab per article section, each showing that section's newest items. The
 * sets used to be hardcoded id lists, which meant an article added in the admin
 * never reached the homepage.
 */
import "server-only";
import { getArticles } from "@/lib/content/articles";
import { articleHref, type ArticleKind } from "@/lib/data/articles";
import type { InsightHubCategory } from "@/lib/data/insightsHub";

/** Cards per tab. Live shows a single row that scrolls. */
const ITEMS_PER_TAB = 10;

const TABS: { key: string; kind: ArticleKind; label: string; hubHref: string; hubLabel: string }[] = [
  { key: "media", kind: "press", label: "PR & Media", hubHref: "/media-press", hubLabel: "View All Press" },
  { key: "blog", kind: "blog", label: "Blog", hubHref: "/insights-blog", hubLabel: "Read More Insights" },
  { key: "news", kind: "news", label: "News", hubHref: "/news-updates", hubLabel: "See All Updates" },
];

export async function getInsightsHub(): Promise<InsightHubCategory[]> {
  const articles = await getArticles();

  return TABS.map(({ key, kind, label, hubHref, hubLabel }) => ({
    key,
    label,
    hubHref,
    hubLabel,
    items: articles
      // getArticles is already newest-first, so this keeps that order.
      .filter((article) => article.kind === kind)
      .slice(0, ITEMS_PER_TAB)
      .map((article) => ({
        image: article.image,
        title: article.title,
        excerpt: article.excerpt,
        href: articleHref(article),
      })),
  }));
}
