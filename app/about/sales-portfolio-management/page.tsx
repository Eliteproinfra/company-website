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
        image="/images/heroes/sales-portfolio.jpg"
        title="Sales Experts"
        breadcrumbCurrent="Sales Portfolio Management"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Meet Our Champions
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Driving Growth, Delivering Excellence
            </h2>
            <p className="mt-5 text-neutral-500">
              The dedicated professionals behind our record-breaking sales.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {salesTeam.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <h3 className="text-xl font-bold text-dark-black">
              Ready to find your dream property?
            </h3>
            <p className="mt-2 text-neutral-500">
              Our experts are just a call away to guide you through your investment journey.
            </p>
            <div className="mt-6">
              <Button href="/contact">Talk to an Expert</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
