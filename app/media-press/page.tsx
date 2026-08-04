import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ArticleCard from "@/components/media/ArticleCard";
import { pressItems } from "@/lib/data/pressItems";

export const metadata: Metadata = {
  title: "Media & Press",
  description: "Press coverage and media mentions featuring Elite Pro Infraventure.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function MediaPressPage() {
  return (
    <>
      <PageHero image="/images/heroes/pr-media.webp" title="Media & Press" breadcrumbCurrent="Media & Press" />

      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pressItems.map((item, index) => (
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
