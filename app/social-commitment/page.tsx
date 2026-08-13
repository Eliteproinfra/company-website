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
        eyebrow="Social Commitment"
        title="Building Beyond Business."
        description="At Elite Pro Infra, we believe that true progress is inclusive. Our commitment extends beyond skylines to the lives we touch and the communities we build."
        breadcrumbCurrent="Social Commitment"
      >
        <div className="flex flex-col items-center gap-5">
          <Button href="#impact-pillars">Explore Our Impact</Button>
          <div className="flex flex-wrap justify-center gap-3">
            {["Community-first initiatives", "Sustainability in action"].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-white/85"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Our Philosophy
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Empowerment through Action
            </h2>
            <p className="mt-5 text-neutral-500">
              We don&apos;t just build structures; we build futures. Our Corporate Social
              Responsibility (CSR) initiatives are deeply rooted in the belief that sustainable
              growth requires a healthy, educated, and empowered society.
            </p>
            <blockquote className="mt-6 border-l-[3px] border-primary-gold pl-5 text-left italic text-dark-black">
              “When women gain skills and opportunities, entire families and communities rise with
              them. We are committed to creating meaningful avenues for financial independence.”
            </blockquote>
          </div>
        </div>
      </section>

      <section id="impact-pillars" className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Areas of Focus"
            title="Pillars of Impact"
            description="Focused programs that create measurable, long-term change for communities we serve."
          />
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
            Join Us in Making a Difference
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500">
            We invite NGOs, volunteers, and corporate partners to collaborate with us in our
            mission to create a more equitable society.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact">Partner With Us</Button>
            <Button href="/contact" variant="outline">
              Volunteer
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
