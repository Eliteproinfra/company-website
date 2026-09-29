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
        image="/images/bg/crm-desk.jpg"
        title="CRM & Accounts"
        description="Ensuring Seamless Operations &amp; Client Satisfaction"
        breadcrumbCurrent="CRM & Marketing"
        hideBreadcrumb
        height="75vh"
        overlay="bg-black/60"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold uppercase tracking-[2px] text-dark-black sm:text-4xl">
              Client Support &amp; Finance
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-[60px] bg-primary-gold" />
            <p className="mt-5 text-muted">
              The backbone of our customer relationships and financial integrity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {crmTeam.map((member) => (
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
              Need assistance with your account?
            </h3>
            <p className="mt-2 text-white/50">Our support team is here to help you with any queries.</p>
          </div>
          <Button href="/contact">Get Support</Button>
        </div>
      </section>
    </>
  );
}
