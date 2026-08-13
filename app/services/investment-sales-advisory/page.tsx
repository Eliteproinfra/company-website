import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHero from "@/components/services/ServiceHero";
import StatsRow from "@/components/services/StatsRow";
import ServiceCard from "@/components/home/ServiceCard";
import ProcessStep from "@/components/property-management/ProcessStep";
import {
  investmentFocusAreas,
  investmentServices,
  investmentStats,
  investmentProcess,
} from "@/lib/data/investmentAdvisory";

export const metadata: Metadata = {
  title: "Investment Sales Advisory",
  description:
    "Maximizing Value. Minimizing Risk. Data-driven strategies and expert guidance to help you navigate complex real estate transactions with confidence.",
};

const serviceDelays = [0, 100, 200, 300, 400, 500] as const;

export default function InvestmentSalesAdvisoryPage() {
  return (
    <>
      <ServiceHero
        image="/images/heroes/investment-sales-advisory.jpg"
        eyebrow="Investment Sales Advisory"
        heading={
          <>
            Maximizing Value. <span className="text-primary-gold">Minimizing Risk.</span>
          </>
        }
        description="Data-driven strategies and expert guidance to help you navigate complex real estate transactions with confidence."
        primaryCta={{ label: "Schedule Consultation", href: "/contact" }}
        secondaryCta={{ label: "Explore Services", href: "#services" }}
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Strategic Advisory
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Unlock the Full Potential of Your Real Estate Portfolio
            </h2>
            <p className="mt-5 text-neutral-500">
              At Elite Pro Infra, we go beyond traditional brokerage. We act as your strategic
              partners, leveraging deep market intelligence and a global network to deliver
              customized investment solutions.
            </p>
            <p className="mt-4 text-neutral-500">
              Whether you are an institutional investor, a private equity firm, or a
              high-net-worth individual, our team provides end-to-end support&mdash;from
              identifying high-yield assets to executing seamless dispositions. We focus on
              creating long-term value through rigorous analysis and innovative strategies.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {investmentFocusAreas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-5"
              >
                <i className="fas fa-check-circle text-primary-gold" aria-hidden="true" />
                <span className="font-medium text-dark-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsRow stats={investmentStats} />

      <section id="services" className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="What We Offer" title="Investment Sales Services" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investmentServices.map((service, index) => (
              <Reveal key={service.title} delay={serviceDelays[index % serviceDelays.length]}>
                <ServiceCard {...service} href="/contact" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Our Process" title="How We Work" />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-10 gap-y-2 rounded-3xl bg-dark-black p-8 sm:grid-cols-2 sm:p-12">
            {investmentProcess.map((step) => (
              <ProcessStep key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-dark-black sm:text-3xl">
            Ready to optimize your real estate strategy?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500">
            Partner with Elite Pro Infra for world-class investment advisory.
          </p>
          <div className="mt-8">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </div>
      </section>
    </>
  );
}
