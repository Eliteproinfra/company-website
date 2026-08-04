import type { Metadata } from "next";
import IconBadge from "@/components/ui/IconBadge";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceLeadForm from "@/components/services/ServiceLeadForm";
import Faq from "@/components/home/Faq";
import {
  nriMarketInsights,
  eliteAdvantage,
  nriExpertise,
  nriFaqs,
} from "@/lib/data/nriAdvisory";
import { nriAdvisoryTestimonial } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "NRI Advisory",
  description:
    "Global Indians, Local Roots — invest in India's growth story without leaving home.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function NriAdvisoryPage() {
  return (
    <>
      <ServiceHero
        image="/images/heroes/nri-advisory.jpg"
        eyebrow="NRI Advisory"
        heading={
          <>
            Global Indians, <span className="text-primary-gold">Local Roots</span>
          </>
        }
        description="Invest in India's growth story without leaving home. We bridge the gap between your global ambitions and Indian real estate opportunities with end-to-end management, legal clarity, and premium assets."
        primaryCta={{ label: "Schedule NRI Consultation", href: "/contact" }}
        secondaryCta={{ label: "Explore Services", href: "#services" }}
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {nriMarketInsights.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center"
              >
                <p className="text-3xl font-bold text-primary-gold sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading
            eyebrow="The Elite Advantage"
            title="Distance Should Not Be a Barrier"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {eliteAdvantage.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-sm">
                  <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-neutral-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border-l-4 border-primary-gold bg-white p-8 text-center shadow-sm">
            <i className="fas fa-quote-left text-2xl text-primary-gold" aria-hidden="true" />
            <p className="mt-4 italic text-neutral-600">&ldquo;{nriAdvisoryTestimonial.quote}&rdquo;</p>
            <h4 className="mt-4 font-bold text-dark-black">{nriAdvisoryTestimonial.name}</h4>
            <p className="text-sm text-primary-gold">{nriAdvisoryTestimonial.role}</p>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Tailored For You" title="NRI Expertise" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {nriExpertise.map((item, index) => (
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

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Common Questions" title="Frequently Asked Questions" />
          <Faq items={nriFaqs} />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Get Started" title="Start Your Investment Journey" />
          <div className="mx-auto max-w-3xl">
            <ServiceLeadForm
              fields={[
                { id: "nri-name", label: "Full Name", type: "text", placeholder: "Full Name" },
                { id: "nri-email", label: "Email Address", type: "email", placeholder: "Email Address" },
                {
                  id: "nri-country",
                  label: "Country of Residence",
                  type: "text",
                  placeholder: "Country of Residence",
                },
              ]}
              submitLabel="Request a Callback"
            />
          </div>
        </div>
      </section>
    </>
  );
}
