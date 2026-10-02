import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import PillarCard from "@/components/social-commitment/PillarCard";
import { pillars, impactStats, philosophyImages } from "@/lib/data/socialCommitment";

export const metadata: Metadata = {
  title: "Social Commitment",
  description:
    "Building Beyond Business — Elite Pro Infraventure's commitment to women empowerment, skill development, and community welfare.",
};

const delaySequence = [0, 100, 200] as const;

const heroBadges = [
  { icon: "fas fa-users", label: "Community-first initiatives" },
  { icon: "fas fa-leaf", label: "Sustainability in action" },
];

/*
 * social-commitment.php: left-aligned .csr-hero (.55 -> .85 over the banner, 80vh) with the
 * gold button and two inline icon badges; white philosophy section (copy + quote box + 2x2
 * photo grid); #impact-pillars .csr-pillars-section #050608; .csr-stats-strip white (#000
 * numbers, #777 labels); white closing CTA with .btn-dark + .btn-outline-dark.
 */
export default function SocialCommitmentPage() {
  return (
    <>
      <section className="flex min-h-[80vh] items-center bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.85)),url('/images/social-commitment/social_banner_1775750017_69d7cb81bb5cf.webp')] bg-cover bg-center text-white">
        <div className="container">
          <div className="max-w-4xl pt-24">
            <span className="mb-3 block text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Social Commitment
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">Building Beyond Business.</h1>
            <p className="mb-12 mt-5 max-w-[600px] text-lg text-white/50">
              At Elite Pro Infra, we believe that true progress is inclusive. Our commitment
              extends beyond skylines to the lives we touch and the communities we build.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="#impact-pillars" className="px-6 py-4">
                Explore Our Impact
              </Button>
              <div className="flex flex-wrap gap-4 text-sm text-white/50">
                {heroBadges.map((badge) => (
                  <span key={badge.label} className="flex items-center gap-2">
                    <i className={`${badge.icon} text-primary-gold`} aria-hidden="true" />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-[100px]">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="lg:pr-12">
              <h6 className="text-sm uppercase tracking-[2px] text-primary-gold">Our Philosophy</h6>
              <h2 className="mt-2 mb-6 text-3xl font-bold text-bs-dark sm:text-4xl lg:text-[3rem]">
                Empowerment through Action
              </h2>
              <p className="text-lg text-bs-muted">
                We don&apos;t just build structures; we build futures. Our Corporate Social
                Responsibility (CSR) initiatives are deeply rooted in the belief that sustainable
                growth requires a healthy, educated, and empowered society.
              </p>
              {/* Live `.csr-quote-box` renders as a black block on desktop. */}
              <blockquote className="mt-6 bg-black p-8">
                <p className="text-white/90">
                  &ldquo;When women gain skills and opportunities, entire families and communities
                  rise with them. We are committed to creating meaningful avenues for financial
                  independence.&rdquo;
                </p>
                <footer className="mt-3 text-sm text-primary-gold">&mdash; Director, Elite Pro Infra</footer>
              </blockquote>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {philosophyImages.map((column, index) => (
                <div key={index} className={index === 1 ? "mt-12" : undefined}>
                  {column.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={600}
                      height={800}
                      className="mb-6 h-auto w-full rounded shadow-bs-lg last:mb-0"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="impact-pillars" className="bg-csr-bg py-20 text-white">
        <div className="container py-12">
          <div className="mb-12 text-center">
            <h6 className="mb-1.5 text-sm font-semibold uppercase tracking-[2px] text-primary-gold">Areas of Focus</h6>
            <h2 className="mb-1.5 text-3xl font-extrabold text-white sm:text-4xl">Pillars of Impact</h2>
            <p className="mx-auto max-w-[620px] text-white/70">
              Focused programs that create measurable, long-term change for communities we serve.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={delaySequence[index % delaySequence.length]}>
                <PillarCard {...pillar} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-10 pt-16">
        <div className="container">
          <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-5 text-center md:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[2.2rem] font-extrabold text-black">{stat.value}</p>
                <p className="mt-1 text-[0.8rem] uppercase tracking-[1.5px] text-csr-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-[100px]">
        <div className="container text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-dark-black sm:text-4xl lg:text-[3rem]">
              Join Us in Making a Difference
            </h2>
            <p className="mb-12 text-lg text-bs-muted">
              We invite NGOs, volunteers, and corporate partners to collaborate with us in our
              mission to create a more equitable society.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="bs-dark" className="px-12 py-4">
                Partner With Us
              </Button>
              <Button href="/contact" variant="dark" className="px-12 py-4">
                Volunteer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
