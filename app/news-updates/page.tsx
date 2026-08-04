import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ArticleCard from "@/components/media/ArticleCard";
import { newsItems } from "@/lib/data/newsItems";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "The latest real estate news and market updates from Gurgaon and Delhi NCR.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function NewsUpdatesPage() {
  return (
    <>
      <PageHero image="/images/heroes/news-updates.jpg" title="News & Updates" breadcrumbCurrent="News & Updates" />

      <section className="bg-white py-20">
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
