import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ArticleCard from "@/components/media/ArticleCard";
import { blogPosts } from "@/lib/data/blogPosts";

export const metadata: Metadata = {
  title: "Insights & Blogs",
  description: "Real estate market insights, project spotlights, and investment guidance from Elite Pro Infraventure.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function InsightsBlogPage() {
  return (
    <>
      <PageHero image="/images/heroes/insights-blog.webp" title="Insights & Blogs" breadcrumbCurrent="Insights & Blogs" />

      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((item, index) => (
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
