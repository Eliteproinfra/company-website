import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import PillarCard from "@/components/social-commitment/PillarCard";
import { pillars, impactStats } from "@/lib/data/socialCommitment";

export const metadata: Metadata = {
  title: "Social Commitment",
  description:
    "Building Beyond Business — Elite Pro Infraventure's commitment to women empowerment, skill development, and community welfare.",
};

const delaySequence = [0, 100, 200] as const;

export default function SocialCommitmentPage() {
  return (
    <>
      <PageHero
        image="/images/social-commitment/social_banner_1775750017_69d7cb81bb5cf.webp"
        title="Building Beyond Business"
        breadcrumbCurrent="Social Commitment"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Empowerment Through Action
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Progress Should Be Inclusive
            </h2>
            <p className="mt-5 text-neutral-500">
              At Elite Pro Infra, we believe that true progress is inclusive. Our commitment
              extends beyond skylines to the lives we touch and the communities we build. When
              women gain skills and opportunities, entire families and communities rise with
              them &mdash; we are committed to creating meaningful avenues for financial
              independence.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Our Focus Areas" title="Three Pillars of Impact" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={delaySequence[index % delaySequence.length]}>
                <PillarCard {...pillar} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_0_0,rgba(212,175,55,0.16),#111827)] py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary-gold sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-dark-black sm:text-3xl">
            Partner With Us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500">
            We invite NGOs, volunteers, and corporate partners to collaborate with us on
            meaningful, lasting impact.
          </p>
          <div className="mt-8">
            <Button href="/contact">Get Involved</Button>
          </div>
        </div>
      </section>
    </>
  );
}
