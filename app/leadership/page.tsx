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
        breadcrumbCurrent="Leadership"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Driven by Purpose
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Architects of Trust &amp; Excellence
            </h2>
            <p className="mt-5 text-neutral-500">
              Real estate is not just about bricks and mortar; it is about dreams, aspirations,
              and legacy. Our leadership builds enduring client relationships on a foundation of
              transparency, integrity, and market intelligence.
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
