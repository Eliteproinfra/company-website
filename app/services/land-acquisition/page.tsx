import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceLeadForm from "@/components/services/ServiceLeadForm";
import {
  acquisitionStrategies,
  growthIndicators,
  landRushDrivers,
} from "@/lib/data/landAcquisition";

export const metadata: Metadata = {
  title: "Land & Acquisition",
  description:
    "Strategic Land Banking — Building the Future, One Acre at a Time. We specialize in identifying, acquiring, and developing high-potential land parcels.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

/*
 * land-acquisition.php: .land-hero (.7 -> rgba(26,26,26,.9), fixed, gold grid),
 * #strategies on #121212 with .strategy-card (#1a1a1a, rgba(255,255,255,.1) border),
 * .market-indicator-section #f8f9fa with .indicator-box, .land-cta #0a0a0a with the
 * skewed gold wash and the dark lead form.
 */
export default function LandAcquisitionPage() {
  return (
    <>
      <ServiceHero
        image="/images/bg/land-field.jpg"
        eyebrow="Strategic Land Banking"
        heading={
          <>
            Building the Future,
            <br />
            One Acre at a Time.
          </>
        }
        description="We specialize in identifying, acquiring, and developing high-potential land parcels. From due diligence to regulatory compliance, we turn ground into gold."
        primaryCta={{ label: "Start Your Acquisition", href: "#consultation" }}
        secondaryCta={{ label: "Explore Strategies", href: "#strategies" }}
        overlay="bg-linear-to-b from-black/70 to-[rgba(26,26,26,0.9)]"
        fixed
        pattern
        minHeight="min-h-[90vh]"
      />

      {/* Strategic Approach Section — live `.strategy-card` on #121212 */}
      <section id="strategies" className="bg-land-dark py-20 text-white lg:py-[100px]">
        <div className="container">
          <SectionHeading
            eyebrow="Our Methodology"
            title="Land Acquisition Strategies"
            description="Success in real estate starts with the right land. Our proven strategies ensure every acquisition aligns with long-term growth objectives."
            dark
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {acquisitionStrategies.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group relative h-full overflow-hidden border border-white/10 bg-light-black p-10 transition-all duration-[400ms] hover:-translate-y-2.5 hover:border-primary-gold hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                  <div className="mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-[4px] bg-primary-gold/10 text-2xl text-primary-gold transition-all duration-[400ms] group-hover:bg-primary-gold group-hover:text-black">
                    <i className={item.icon} aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-4 leading-[1.7] text-white/60">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Indicators — live `.market-indicator-section` */}
      <section className="bg-bs-light py-20 lg:py-[100px]">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <Reveal direction="right" className="lg:col-span-5">
              <SectionHeading
                eyebrow="Why Invest Now?"
                title="India's Land Rush"
                align="left"
                separator={false}
                className="mb-6"
              />
              <p className="text-muted">
                Leading developers like Godrej, DLF, and Prestige are aggressively expanding their
                land banks. The market is witnessing a clear shift towards premium developments in
                high-growth corridors.
              </p>
              <ul className="mt-6 space-y-5">
                {landRushDrivers.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 text-muted-3">
                    <i
                      className="fas fa-check-circle mt-1 text-lg text-primary-gold"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="text-dark-black">{item.title}:</strong> {item.description}
                    </span>
                  </li>
                ))}
              </ul>
              <Button href="#consultation" variant="bs-dark" className="mt-8">
                Download Market Report
              </Button>
            </Reveal>

            <div className="grid grid-cols-2 gap-6 lg:col-span-6 lg:col-start-7">
              {growthIndicators.map((item, index) => (
                <Reveal key={item.number} delay={delaySequence[(index + 1) % delaySequence.length]}>
                  <div className="h-full rounded-lg border-b-[3px] border-transparent bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-b-primary-gold sm:p-[30px]">
                    <span className="-mb-5 block text-[3rem] font-black leading-none text-black/5">
                      {item.number}
                    </span>
                    <div className="relative pt-[10px]">
                      <h3 className="font-bold text-dark-black">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — live `.land-cta` */}
      <section id="consultation" className="relative overflow-hidden bg-dark-black py-20 lg:py-[100px]">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/2 -skew-x-[20deg] bg-linear-to-r from-transparent to-primary-gold/5"
        />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-[3.5rem]">
              Ready to Expand Your Portfolio?
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Whether you are a developer looking for the next big project or an investor seeking
              long-term appreciation, we have the right land parcels for you.
            </p>
            <div className="mt-10">
              <ServiceLeadForm
                source="Land Acquisition"
                tone="dark"
                fields={[
                  {
                    id: "land-phone",
                    label: "Phone Number",
                    type: "tel",
                    placeholder: "Enter Phone Number",
                  },
                ]}
                submitLabel="Request Callback"
              />
            </div>
            <p className="mt-4 text-sm text-white/50">
              <i className="fas fa-lock mr-2" aria-hidden="true" />
              Your information is kept strictly confidential.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
