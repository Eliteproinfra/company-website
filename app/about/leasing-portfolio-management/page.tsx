import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import TeamMemberCard from "@/components/about/TeamMemberCard";
import { leasingTeam } from "@/lib/data/teams";

export const metadata: Metadata = {
  title: "Leasing Portfolio Management",
  description:
    "Experts in Commercial & Retail Leasing Strategies — maximizing value for occupiers and owners.",
};

const propertyExamples = [
  { category: "Residential", names: ["Birla Pravaah", "Emaar Serenity Hills"] },
  { category: "Commercial", names: ["AIPL Joy Central", "Conscient SOHO"] },
  { category: "SCO Plots", names: ["Emaar EBD 65", "M3M SCO 113 Market"] },
];

export default function LeasingPortfolioManagementPage() {
  return (
    <>
      <PageHero
        image="/images/heroes/leasing-portfolio.jpg"
        title="Leasing Experts"
        breadcrumbCurrent="Leasing Portfolio Management"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Maximizing Value for Occupiers &amp; Owners
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Experts in Commercial &amp; Retail Leasing Strategies
            </h2>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-1">
            {leasingTeam.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {propertyExamples.map((group) => (
              <div key={group.category} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
                <h3 className="font-bold text-dark-black">{group.category}</h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-500">
                  {group.names.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <h3 className="text-xl font-bold text-dark-black">
              Looking for the perfect office space?
            </h3>
            <p className="mt-2 text-neutral-500">
              Let our leasing experts find the best location for your business.
            </p>
            <div className="mt-6">
              <Button href="/contact">Consult Now</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
