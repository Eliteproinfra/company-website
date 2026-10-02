import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import TeamMemberCard from "@/components/about/TeamMemberCard";
import { salesTeam } from "@/lib/data/teams";

export const metadata: Metadata = {
  title: "Sales Portfolio Management",
  description: "Meet Our Champions — the dedicated sales professionals behind Elite Pro Infraventure's record-breaking sales.",
};

export default function SalesPortfolioManagementPage() {
  return (
    <>
      <PageHero
        image="/images/bg/sales-team.jpg"
        title="Sales Experts"
        description="Driving Growth, Delivering Excellence"
        breadcrumbCurrent="Sales Portfolio Management"
        hideBreadcrumb
        height="75vh"
        overlay="bg-black/60"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold uppercase tracking-[2px] text-dark-black sm:text-4xl">
              Meet Our Champions
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-[60px] bg-primary-gold" />
            <p className="mt-5 text-muted">
              The dedicated professionals behind our record-breaking sales.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {salesTeam.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>

        </div>
      </section>

      {/* Live `section.py-5.bg-dark-black.text-white` closing CTA */}
      <section className="bg-dark-radial py-16 text-white">
        <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Ready to find your dream property?
            </h3>
            <p className="mt-2 text-white/50">Our experts are just a call away to guide you through your investment journey.</p>
          </div>
          <Button href="/contact">Talk to an Expert</Button>
        </div>
      </section>
    </>
  );
}
