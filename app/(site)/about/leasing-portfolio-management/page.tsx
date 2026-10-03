import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import TeamMemberCard from "@/components/about/TeamMemberCard";
import { getTeam } from "@/lib/content/teams";

export const metadata: Metadata = {
  title: "Leasing Portfolio Management",
  description:
    "Experts in Commercial & Retail Leasing Strategies — maximizing value for occupiers and owners.",
};

export default async function LeasingPortfolioManagementPage() {
  const leasingTeam = await getTeam("leasing");

  return (
    <>
      <PageHero
        image="/images/bg/leasing-office.jpg"
        title="Leasing Experts"
        description="Maximizing Value for Occupiers &amp; Owners"
        breadcrumbCurrent="Leasing Portfolio Management"
        hideBreadcrumb
        height="75vh"
        overlay="bg-black/60"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold uppercase tracking-[2px] text-dark-black sm:text-4xl">The Leasing Team</h2>
            <div className="mx-auto mt-4 h-[3px] w-[60px] bg-primary-gold" />
            <p className="mt-5 text-muted">
              Experts in commercial &amp; retail leasing strategies.
            </p>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-1">
            {leasingTeam.map((member, index) => (
              // Keyed by position too: the admin cannot stop two people sharing
              // a name, and a duplicate key would drop one of the cards.
              <TeamMemberCard key={`${index}-${member.name}`} {...member} />
            ))}
          </div>

        </div>
      </section>

      {/* Live `section.py-5.bg-dark-black.text-white` closing CTA */}
      <section className="bg-dark-radial py-16 text-white">
        <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Looking for the perfect office space?
            </h3>
            <p className="mt-2 text-white/50">Let our leasing experts find the best location for your business.</p>
          </div>
          <Button href="/contact">Consult Now</Button>
        </div>
      </section>
    </>
  );
}
