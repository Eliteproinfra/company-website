import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ArticleCard from "@/components/media/ArticleCard";
import { articleHref, articlesByKind } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "The latest real estate news and market updates from Gurgaon and Delhi NCR.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

const newsItems = articlesByKind("news").map((article) => ({
  title: article.title,
  date: article.date,
  excerpt: article.excerpt,
  image: article.image,
  href: articleHref(article),
}));

export default function NewsUpdatesPage() {
  return (
    <>
      <PageHero image="/images/heroes/news-updates.jpg" title="News & Updates" breadcrumbCurrent="News & Updates" uppercase overlay="bg-linear-to-b from-black/70 to-black/80" />

      <section className="bg-bs-light py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item, index) => (
              <Reveal key={item.href} delay={delaySequence[index % delaySequence.length]}>
                <ArticleCard {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
