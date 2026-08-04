import type { Metadata } from "next";
import IconBadge from "@/components/ui/IconBadge";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHero from "@/components/services/ServiceHero";
import JobListingCard from "@/components/careers/JobListingCard";
import CareerApplicationForm from "@/components/careers/CareerApplicationForm";
import { jobListings, cultureHighlights } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Our Talent Community — Where Excellence Meets Opportunity. Build a career that defines the future of real estate.",
};

const delaySequence = [0, 100, 200, 300] as const;

export default function CareersPage() {
  return (
    <>
      <ServiceHero
        image="/images/heroes/careers.jpg"
        eyebrow="Careers"
        heading="Join Our Talent Community"
        description="Where Excellence Meets Opportunity. Build a career that defines the future of real estate."
        primaryCta={{ label: "View Open Roles", href: "#openings" }}
        secondaryCta={{ label: "Apply Now", href: "#apply" }}
      />

      <section id="openings" className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Current Openings" title="Open Positions" />
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {jobListings.map((job) => (
              <JobListingCard key={job.title} {...job} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Why Elite Pro?" title="Culture &amp; Benefits" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cultureHighlights.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-white p-6 text-center">
                  <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-4" />
                  <h3 className="font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border-l-4 border-primary-gold bg-white p-8 text-center shadow-sm">
            <i className="fas fa-quote-left text-2xl text-primary-gold" aria-hidden="true" />
            <p className="mt-4 italic text-neutral-600">
              &ldquo;Elite Pro Infra is a launchpad for ambitious minds &mdash; career progression
              here is guided, celebrated, and elevated.&rdquo;
            </p>
            <h4 className="mt-4 font-bold text-dark-black">Head of Human Resources</h4>
            <p className="text-sm text-primary-gold">Elite Pro Infraventure</p>
          </div>
        </div>
      </section>

      <section id="apply" className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Take the First Step" title="Apply Now" />
          <div className="mx-auto max-w-2xl">
            <CareerApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
}
