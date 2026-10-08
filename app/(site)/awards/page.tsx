import type { Metadata } from "next";
import AwardsGrid from "@/components/awards/AwardsGrid";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/home/Faq";
import { getAwards } from "@/lib/content/awards";
import { homeFaqs } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "Awards & Recognitions",
  description: "Honoring our commitment to excellence and innovation in real estate.",
};

/*
 * awards.php: .awards-hero (.6 -> .7 over the trophy photo, 40vh, uppercase title, breadcrumb
 * "Awards"), .awards-gallery-section ("Our Achievements", gold radial to white with the
 * repeating trophy line-art at 18%), then the same skyline #faq block and FAQs as the home page.
 */
export default async function AwardsPage() {
  const awards = await getAwards();

  return (
    <>
      <PageHero
        image="/images/bg/awards-trophy.jpg"
        title="Awards & Recognitions"
        breadcrumbCurrent="Awards"
        height="40vh"
        overlay="bg-linear-to-b from-black/60 to-black/70"
        uppercase
      />

      <section className="relative overflow-hidden bg-awards-gallery py-20">
        <div className="absolute inset-0 bg-trophy-pattern opacity-[0.18]" aria-hidden="true" />
        <div className="container relative z-[1]">
          <SectionHeading
            title="Our Achievements"
            description="Honoring our commitment to excellence and innovation in real estate."
          />
          <AwardsGrid awards={awards} />
        </div>
      </section>

      <section className="relative bg-faq-section py-20 text-white">
        <div className="absolute inset-0 bg-overlay-dark" aria-hidden="true" />
        <div className="container relative z-[1]">
          <SectionHeading
            title="Frequently Asked Questions"
            description="Common queries about real estate investment"
            dark
          />
          <Faq items={homeFaqs} dark />
        </div>
      </section>
    </>
  );
}
