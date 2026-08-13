import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/home/Faq";
import { awardImages } from "@/lib/data/awards";
import { awardsFaqs } from "@/lib/data/awardsFaq";

export const metadata: Metadata = {
  title: "Awards & Recognitions",
  description: "Honoring our commitment to excellence and innovation in real estate.",
};

export default function AwardsPage() {
  return (
    <>
      <PageHero
        image="/images/heroes/awards.jpg"
        title="Awards & Recognitions"
        breadcrumbCurrent="Awards & Recognitions"
      />

      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Recognized For Excellence"
            title="Honoring Our Commitment to Excellence"
            description="Honoring our commitment to excellence and innovation in real estate."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {awardImages.map((image) => (
              <div
                key={image}
                className="flex aspect-square items-center justify-center rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                <Image
                  src={image}
                  alt="Elite Pro Infraventure award recognition"
                  width={140}
                  height={140}
                  className="h-auto max-h-full w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading
            title="Frequently Asked Questions"
            description="Common queries about real estate investment"
          />
          <Faq items={awardsFaqs} />
        </div>
      </section>
    </>
  );
}
