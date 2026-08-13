import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/insights/ArticleDetail";
import {
  articleSections,
  articlesByKind,
  getArticle,
  type ArticleKind,
} from "@/lib/data/articles";

type Params = { params: Promise<{ slug: string }> };

/**
 * PR, blog and news detail pages are identical apart from their section, so each
 * route file just re-exports the handlers this builds.
 */
export function buildArticlePage(kind: ArticleKind) {
  function generateStaticParams() {
    return articlesByKind(kind).map((article) => ({ slug: article.slug }));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticle(kind, slug);
    if (!article) return { title: "Article Not Found" };

    return {
      title: article.title,
      description: article.excerpt,
      alternates: { canonical: `${articleSections[kind].basePath}/${slug}` },
      openGraph: {
        type: "article",
        title: article.title,
        description: article.excerpt,
        publishedTime: article.date,
        images: article.image ? [{ url: article.image, alt: article.title }] : undefined,
      },
    };
  }

  async function Page({ params }: Params) {
    const { slug } = await params;
    const article = getArticle(kind, slug);
    if (!article) notFound();

    return <ArticleDetail article={article} />;
  }

  return { generateStaticParams, generateMetadata, Page };
}
