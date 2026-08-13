import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import IconBadge from "@/components/ui/IconBadge";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceLeadForm from "@/components/services/ServiceLeadForm";
import { acquisitionStrategies, landRushDrivers, valuePropositions } from "@/lib/data/landAcquisition";

export const metadata: Metadata = {
  title: "Land & Acquisition",
  description: "Strategic Land Banking — Building the Future, One Acre at a Time.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function LandAcquisitionPage() {
  return (
    <>
      <ServiceHero
        image="/images/heroes/land-acquisition.jpg"
        eyebrow="Land & Acquisition"
        heading={
          <>
            Strategic <span className="text-primary-gold">Land Banking</span>
          </>
        }
        description="Building the Future, One Acre at a Time. We specialize in land identification, acquisition, and development — transforming ground into growth."
        primaryCta={{ label: "Request Callback", href: "#request-callback" }}
        secondaryCta={{ label: "Our Strategy", href: "#strategy" }}
      />

      <section id="strategy" className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Our Approach" title="Land Acquisition Strategies" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {acquisitionStrategies.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
                  <IconBadge icon={item.icon} variant="tinted" className="mb-4" />
                  <h3 className="font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f0f0f] py-20">
        <div className="container">
          <SectionHeading eyebrow="Market Context" title="India's Land Rush" dark />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {landRushDrivers.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-4" />
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Why Partner With Us" title="Our Value Proposition" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valuePropositions.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="h-full rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-center">
                  <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="request-callback" className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Expand Your Portfolio"
            title="Ready to Expand Your Portfolio?"
            description="For developers and investors looking to identify their next land acquisition."
          />
          <div className="mx-auto max-w-3xl">
            <ServiceLeadForm
              source="Land Acquisition"
              fields={[
                { id: "land-name", label: "Full Name", type: "text", placeholder: "Full Name" },
                { id: "land-phone", label: "Phone Number", type: "tel", placeholder: "Phone Number" },
                { id: "land-budget", label: "Investment Budget", type: "text", placeholder: "Investment Budget" },
              ]}
              submitLabel="Request Callback"
            />
          </div>
          <div className="mt-10 text-center">
            <Button href="/contact" variant="outline">
              Speak To Our Team
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
