import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import TeamMemberCard from "@/components/about/TeamMemberCard";
import { crmTeam } from "@/lib/data/teams";

export const metadata: Metadata = {
  title: "CRM & Marketing",
  description:
    "CRM & Accounts — ensuring seamless operations and client satisfaction at Elite Pro Infraventure.",
};

export default function CrmMarketingPage() {
  return (
    <>
      <PageHero
        image="/images/heroes/crm-marketing.jpg"
        title="CRM & Accounts"
        breadcrumbCurrent="CRM & Marketing"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Ensuring Seamless Operations &amp; Client Satisfaction
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Client Support &amp; Finance
            </h2>
            <p className="mt-5 text-neutral-500">
              The backbone of our customer relationships and financial integrity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {crmTeam.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <h3 className="text-xl font-bold text-dark-black">
              Need assistance with your account?
            </h3>
            <p className="mt-2 text-neutral-500">
              Our support team is here to help you with any queries.
            </p>
            <div className="mt-6">
              <Button href="/contact">Get Support</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
