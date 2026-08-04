import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import IconBadge from "@/components/ui/IconBadge";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryCard from "@/components/careers/GalleryCard";
import { cultureItems, momentsGallery, joinBenefits } from "@/lib/data/lifeAtElite";

export const metadata: Metadata = {
  title: "Life at Elite Pro Infra",
  description: "Where Passion Meets Purpose — culture, celebrations, and community at Elite Pro Infraventure.",
};

const delaySequence = [0, 100, 200, 300] as const;

export default function LifeAtElitePage() {
  return (
    <>
      <PageHero
        image="/images/heroes/life-at-elite.jpg"
        title="Where Passion Meets Purpose"
        breadcrumbCurrent="Life at Elite Pro Infra"
      />

      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Our Culture" title="More Than Just a Workplace" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {cultureItems.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center">
                  <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-4" />
                  <h3 className="font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-neutral-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Moments of Joy" title="Life at Elite Pro Infra" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {momentsGallery.map((item) => (
              <GalleryCard key={item.image} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Social Responsibility
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              We Measure Success By The Impact We Create
            </h2>
            <p className="mt-5 text-neutral-500">
              Our team gets involved in education initiatives, environmental sustainability, and
              community health programs &mdash; because giving back is part of who we are.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Why Join Elite?" title="Benefits of Working With Us" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {joinBenefits.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-white p-6 text-center">
                  <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-4" />
                  <h3 className="font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/careers">View Open Positions</Button>
          </div>
        </div>
      </section>
    </>
  );
}
