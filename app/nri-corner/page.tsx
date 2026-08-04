import type { Metadata } from "next";
import IconBadge from "@/components/ui/IconBadge";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceLeadForm from "@/components/services/ServiceLeadForm";
import Faq from "@/components/home/Faq";
import { investNowReasons, investmentGuide, nriCornerFaqs } from "@/lib/data/nriCorner";

export const metadata: Metadata = {
  title: "NRI Corner",
  description:
    "India is Calling. Invest in the Future. Secure your legacy with premium real estate in the world's fastest-growing major economy.",
};

const delaySequence = [0, 100, 200, 300] as const;

export default function NriCornerPage() {
  return (
    <>
      <ServiceHero
        image="/images/heroes/nri-corner.jpg"
        eyebrow="NRI Corner"
        heading={
          <>
            India is Calling. <span className="text-primary-gold">Invest in the Future.</span>
          </>
        }
        description="Secure your legacy with premium real estate in the world's fastest-growing major economy. We simplify cross-border investments."
        primaryCta={{ label: "Get Investment Guide", href: "#guide" }}
        secondaryCta={{ label: "Talk to an Expert", href: "#start" }}
      />

      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="The Opportunity" title="Why Invest in India Now?" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {investNowReasons.map((stat) => (
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

      <section id="guide" className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Know Before You Invest" title="NRI Investment Guide" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {investmentGuide.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-white p-8">
                  <IconBadge icon={item.icon} variant="tinted" className="mb-4" />
                  <h3 className="text-lg font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-neutral-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Common Questions" title="Frequently Asked Questions" />
          <Faq items={nriCornerFaqs} />
        </div>
      </section>

      <section id="start" className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Get Started" title="Start Your Investment Journey" />
          <div className="mx-auto mb-8 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-8">
            <a
              href="mailto:marketing@eliteproinfra.com"
              className="flex items-center gap-2 font-semibold text-dark-black hover:text-primary-gold"
            >
              <i className="fas fa-envelope text-primary-gold" aria-hidden="true" />
              marketing@eliteproinfra.com
            </a>
            <a
              href="https://wa.me/919968686868"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-semibold text-dark-black hover:text-primary-gold"
            >
              <i className="fab fa-whatsapp text-primary-gold" aria-hidden="true" />
              +91 9968686868
            </a>
          </div>
          <div className="mx-auto max-w-3xl">
            <ServiceLeadForm
              fields={[
                { id: "corner-name", label: "Full Name", type: "text", placeholder: "Full Name" },
                { id: "corner-email", label: "Email Address", type: "email", placeholder: "Email Address" },
                { id: "corner-phone", label: "Phone Number", type: "tel", placeholder: "Phone Number" },
              ]}
              submitLabel="Request a Callback"
            />
          </div>
        </div>
      </section>
    </>
  );
}
