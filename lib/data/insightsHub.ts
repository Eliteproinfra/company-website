import { articleHref, getArticleById, type ArticleKind } from "@/lib/data/articles";

export type InsightHubItem = {
  image: string;
  title: string;
  excerpt: string;
  href: string;
};

export type InsightHubCategory = {
  key: string;
  label: string;
  hubHref: string;
  hubLabel: string;
  items: InsightHubItem[];
};

// The exact sets the live homepage shows under each tab, newest first.
const featured: {
  key: string;
  kind: ArticleKind;
  label: string;
  hubHref: string;
  hubLabel: string;
  ids: number[];
}[] = [
  {
    key: "media",
    kind: "press",
    label: "PR & Media",
    hubHref: "/media-press",
    hubLabel: "View All Press",
    ids: [132, 130, 129, 128, 127],
  },
  {
    key: "blog",
    kind: "blog",
    label: "Blog",
    hubHref: "/insights-blog",
    hubLabel: "Read More Insights",
    ids: [169, 162, 161, 157, 156, 152, 148, 144, 93, 91],
  },
  {
    key: "news",
    kind: "news",
    label: "News",
    hubHref: "/news-updates",
    hubLabel: "See All Updates",
    ids: [171, 170, 168, 165, 164, 163, 159, 158],
  },
];

export const insightsHub: InsightHubCategory[] = featured.map(
  ({ key, kind, label, hubHref, hubLabel, ids }) => ({
    key,
    label,
    hubHref,
    hubLabel,
    items: ids
      .map((id) => getArticleById(kind, id))
      .filter((article) => article !== undefined)
      .map((article) => ({
        image: article.image,
        title: article.title,
        excerpt: article.excerpt,
        href: articleHref(article),
      })),
  })
);
