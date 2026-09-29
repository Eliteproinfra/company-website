import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
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

/*
 * nri-advisory.php: .nri-hero-premium (.6 -> .4, fixed, frosted badge eyebrow),
 * .section-dark-modern #0f0f0f stats, .bg-light advantage cards (.advantage-card with
 * #fff8e1 icon circles), white #services, .bg-light FAQ, .section-dark-modern consultation.
 */
export default function NriAdvisoryPage() {
  return (
    <>
      <ServiceHero
        image="/images/bg/nri-advisory.jpg"
        eyebrow="Global Indians, Local Roots"
        eyebrowStyle="badge"
        heading={
          <>
            Invest in India&apos;s Growth Story
            <br />
            <span className="text-primary-gold">Without Leaving Home</span>
          </>
        }
        description="We bridge the gap between your global ambitions and Indian real estate opportunities with end-to-end management, legal clarity, and premium assets."
        primaryCta={{ label: "Schedule NRI Consultation", href: "#consultation" }}
        secondaryCta={{ label: "Explore Services", href: "#services" }}
        overlay="bg-linear-to-b from-black/60 to-black/40"
        fixed
        minHeight="min-h-[90vh]"
      />

      {/* Why India Now (Stats) — live `.nri-stat-box` on `.section-dark-modern` */}
      <section className="bg-dark-modern py-20 text-white lg:py-[100px]">
        <div className="container">
          <SectionHeading eyebrow="Market Insights" title="Why Invest in India Now?" dark />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {nriMarketInsights.map((stat, index) => (
              <Reveal key={stat.label} delay={delaySequence[(index + 1) % delaySequence.length]}>
                <div className="h-full rounded-[15px] border border-white/10 bg-white/5 p-[30px] text-center transition-all duration-300 hover:-translate-y-[5px] hover:border-primary-gold hover:bg-white/10">
                  <span className="block text-[2.5rem] font-bold text-primary-gold">{stat.value}</span>
                  <span className="mt-1 block text-[0.9rem] uppercase tracking-[1px] text-[#ccc]">
                    {stat.label}
                  </span>
                  <p className="mt-3 text-sm text-bs-secondary">{stat.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions — live `.advantage-card` */}
      <section className="bg-bs-light py-20 lg:py-[100px]">
        <div className="container">
          <SectionHeading
            eyebrow="The Elite Advantage"
            title="Distance Should Not Be a Barrier"
            description="Managing Indian assets from abroad can be complex. We simplify every step, acting as your trusted local partner."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {eliteAdvantage.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="h-full rounded-[10px] border border-border-card bg-white p-[30px] text-center shadow-card-lg transition-all duration-300 hover:-translate-y-2.5 hover:border-primary-gold">
                  <div className="mx-auto mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gold-tint text-2xl text-primary-gold">
                    <i className={item.icon} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {/* Live `.testimonial-card`: white, 5px gold left border, 1px #d1d1d1, 0 10px 20px rgba(0,0,0,.03) */}
          <div className="mx-auto mt-10 max-w-2xl border border-border-card-strong border-l-[5px] border-l-primary-gold bg-white p-10 text-center shadow-[0_10px_20px_rgba(0,0,0,0.03)]">
            <i className="fas fa-quote-left text-2xl text-primary-gold" aria-hidden="true" />
            <p className="mt-4 italic text-muted-2">&ldquo;{nriAdvisoryTestimonial.quote}&rdquo;</p>
            <h4 className="mt-4 font-bold text-dark-black">{nriAdvisoryTestimonial.name}</h4>
            <p className="text-sm text-primary-gold">{nriAdvisoryTestimonial.role}</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-20 lg:py-[100px]">
        <div className="container">
          <SectionHeading eyebrow="Our Expertise" title="Tailored NRI Services" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {nriExpertise.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group flex h-full flex-col border border-border-card bg-white p-6">
                  {/* Live `.nri-icon`: 60px #0a0a0a square with a gold glyph */}
                  <div className="mb-6 flex h-[60px] w-[60px] items-center justify-center bg-dark-black text-2xl text-primary-gold">
                    <i className={item.icon} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-bs-dark">{item.title}</h3>
                  <p className="mt-2 flex-1 text-bs-muted">{item.description}</p>
                  <Link href="#consultation" className="mt-4 text-sm font-bold text-primary-gold">
                    Learn More <i className="fas fa-arrow-right ml-1 text-xs" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-bs-light py-20 lg:py-[100px]">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal direction="right" className="lg:col-span-5">
              <SectionHeading
                eyebrow="Common Questions"
                title="NRI Investment FAQs"
                align="left"
                separator={false}
                className="mb-4"
              />
              <p className="text-muted">
                Everything you need to know about investing in Indian real estate as a
                Non-Resident Indian.
              </p>
              <Button href="#consultation" variant="bs-dark" className="mt-6">
                Ask an Expert
              </Button>
            </Reveal>
            <Reveal direction="left" className="lg:col-span-6 lg:col-start-7">
              <Faq items={nriFaqs} className="" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA / Consultation Section */}
      <section id="consultation" className="bg-dark-modern py-20 text-center text-white lg:py-[100px]">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-[3.5rem]">
              Start Your Indian Investment Journey
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Join 1,400+ happy families who have trusted us with their real estate wealth.
              Schedule a personalized consultation today.
            </p>
            <div className="mx-auto mt-10 w-full max-w-[500px]">
              <ServiceLeadForm
                source="NRI Advisory"
                layout="stacked"
                className="rounded-xl bg-white p-6"
                fields={[
                  { id: "nri-name", label: "Name", type: "text", placeholder: "Your Name" },
                  { id: "nri-email", label: "Email", type: "email", placeholder: "Your Email" },
                  {
                    id: "nri-country",
                    label: "Country of Residence",
                    type: "text",
                    placeholder: "e.g., USA, UAE, UK",
                  },
                ]}
                submitLabel="Request Callback"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
