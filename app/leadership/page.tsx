import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import LeaderCard from "@/components/leadership/LeaderCard";
import { leaders } from "@/lib/data/leadership";
import { leadershipStats } from "@/lib/data/stats";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Architects of Trust & Excellence — meet the founders and leadership team driving Elite Pro Infraventure.",
};

const delaySequence = [0, 100, 200] as const;

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        image="/images/heroes/leadership.webp"
        title="Our Leadership"
        description="Architects of Trust &amp; Excellence"
        breadcrumbCurrent="Leadership"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Our Philosophy
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Driven by Purpose
            </h2>
            <p className="mt-5 text-neutral-500">
              Real estate is not just about bricks and mortar; it is about dreams, aspirations, and
              legacy. At Elite Pro Infra, we don&apos;t just facilitate transactions; we build
              enduring relationships founded on transparency, integrity, and deep market
              intelligence.
            </p>
            <p className="mt-4 text-neutral-500">
              Our leadership team combines decades of industry experience with a forward-thinking
              approach, ensuring that every client receives not just a property, but a future-proof
              investment. We are committed to redefining luxury real estate advisory in India.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {leaders.map((leader, index) => (
              <Reveal key={leader.name} delay={delaySequence[index % delaySequence.length]}>
                <LeaderCard {...leader} reverse={index % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_0_0,rgba(212,175,55,0.16),#111827)] py-16 md:py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              The Force Behind The Vision
            </h2>
            <p className="mt-3 text-primary-gold">
              A diverse team of professionals united by a common goal.
            </p>
            <p className="mt-5 text-white/60">
              Our strength lies in our people. We are a collective of seasoned industry veterans,
              financial experts, legal advisors, and dynamic young professionals. We champion
              diversity and believe that the best solutions come from a multitude of perspectives.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-center sm:max-w-md sm:mx-auto">
            {leadershipStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-primary-gold sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
