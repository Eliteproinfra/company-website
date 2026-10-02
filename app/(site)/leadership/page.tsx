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

/*
 * leadership.php ships its own palette (--elite-gold #bfa881, --elite-black #1a1a1a):
 * hero rgba(0,0,0,.6) flat + fixed, .vision-section white, .leader-profile-section
 * #f9f9f9, .team-strength-section #1a1a1a with rgba(255,255,255,.02) stat boxes.
 */
export default function LeadershipPage() {
  return (
    <>
      <PageHero
        image="/images/heroes/leadership.webp"
        title="Our Leadership"
        description="Architects of Trust &amp; Excellence"
        breadcrumbCurrent="Leadership"
        overlay="bg-black/60"
        fixed
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-leader-gold">
              Our Philosophy
            </p>
            <h2 className="mt-2 text-3xl font-bold text-light-black sm:text-4xl">
              Driven by Purpose
            </h2>
            <div className="mt-8 border-l-4 border-leader-gold bg-leader-quote p-8 text-left shadow-card-lg">
              <p className="text-muted-2">
                Real estate is not just about bricks and mortar; it is about dreams, aspirations, and
                legacy. At Elite Pro Infra, we don&apos;t just facilitate transactions; we build
                enduring relationships founded on transparency, integrity, and deep market
                intelligence.
              </p>
              <p className="mt-4 text-muted-2">
                Our leadership team combines decades of industry experience with a forward-thinking
                approach, ensuring that every client receives not just a property, but a future-proof
                investment. We are committed to redefining luxury real estate advisory in India.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-leader-profile py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-8">
            {leaders.map((leader, index) => (
              <Reveal key={leader.name} delay={delaySequence[index % delaySequence.length]}>
                <LeaderCard {...leader} reverse={index % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-black py-16 text-white md:py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              The Force Behind The Vision
            </h2>
            <p className="mt-3 text-leader-gold">
              A diverse team of professionals united by a common goal.
            </p>
            <p className="mt-5 text-white/85">
              Our strength lies in our people. We are a collective of seasoned industry veterans,
              financial experts, legal advisors, and dynamic young professionals. We champion
              diversity and believe that the best solutions come from a multitude of perspectives.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-center sm:mx-auto sm:max-w-md">
            {leadershipStats.map((stat) => (
              <div
                key={stat.label}
                className="border border-white/10 bg-white/[0.02] p-[30px] transition-all duration-300 hover:border-leader-gold hover:bg-white/5"
              >
                <p className="font-serif text-4xl font-bold text-leader-gold sm:text-[3rem]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[1px] text-white/85">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
