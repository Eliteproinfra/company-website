import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import ServiceHero from "@/components/services/ServiceHero";
import Faq from "@/components/home/Faq";
import GuideTabs from "@/components/nri/GuideTabs";
import NriCallbackForm from "@/components/nri/NriCallbackForm";
import { growthReasons, guideTabs, nriCornerFaqs } from "@/lib/data/nriCorner";

export const metadata: Metadata = {
  title: "NRI Corner",
  description:
    "India is Calling. Invest in the Future. Secure your legacy with premium real estate in the world's fastest-growing major economy.",
};

const delaySequence = [0, 100, 200] as const;

/*
 * nri-corner.php: .nri-corner-hero (.5 -> .7, fixed, fades to white; eyebrow "Welcome Home",
 * .btn-gold + .btn-outline-light), white "Growth Story" (.growth-card), .bg-light Knowledge
 * Bank (.service-tab-nav + white content card), white FAQ (.guideline-accordion),
 * #contact-nri .nri-contact-section #0b0b0b with the .bg-dark callback form.
 */
export default function NriCornerPage() {
  return (
    <>
      <ServiceHero
        image="/images/bg/nri-corner.jpg"
        eyebrow="Welcome Home"
        heading={
          <>
            India is Calling.
            <br />
            Invest in the Future.
          </>
        }
        description="Secure your legacy with premium real estate in the world's fastest-growing major economy. We simplify cross-border investments."
        primaryCta={{ label: "Investment Guide", href: "#investment-guide" }}
        secondaryCta={{ label: "Speak to an Expert", href: "#contact-nri" }}
        overlay="bg-linear-to-b from-black/50 to-black/70"
        fixed
        fadeToWhite
        plainBar
        minHeight="min-h-[85vh]"
      />

      {/* The Growth Story */}
      <section className="bg-white py-20 lg:py-[100px]">
        <div className="container">
          <div className="mb-12 text-center">
            <h6 className="text-sm uppercase tracking-[2px] text-primary-gold">The Growth Story</h6>
            <h2 className="mt-2 inline-block text-3xl font-bold text-bs-dark after:mt-[15px] after:block after:h-[3px] after:w-[60px] after:bg-primary-gold after:content-[''] sm:text-4xl lg:text-[3rem]">
              Why Invest in India Now?
            </h2>
            <p className="mx-auto mt-6 max-w-[700px] text-bs-muted">
              India&apos;s real estate sector is a key beneficiary of the country&apos;s rapid
              economic expansion and infrastructure overhaul.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {growthReasons.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                {/* Live `.growth-card`: white, 10px radius, 0 10px 30px rgba(0,0,0,.05), 4px top
                    border that turns gold on hover while the card lifts 5px. */}
                <div className="h-full rounded-[10px] border-t-4 border-transparent bg-white p-[30px] text-center shadow-card-lg transition-all duration-300 hover:-translate-y-[5px] hover:border-primary-gold">
                  <i className={`${item.icon} mb-5 block text-[2.5rem] text-primary-gold`} aria-hidden="true" />
                  <h4 className="text-xl font-bold text-dark-black">{item.title}</h4>
                  <p className="mt-3 text-sm text-bs-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Bank */}
      <section id="investment-guide" className="bg-bs-light py-20 lg:py-[100px]">
        <div className="container">
          <div className="mb-12 lg:max-w-1/2">
            <h6 className="text-sm uppercase tracking-[2px] text-primary-gold">Knowledge Bank</h6>
            <h2 className="mt-2 text-3xl font-bold text-bs-dark sm:text-4xl lg:text-[3rem]">
              NRI Investment Guide
            </h2>
          </div>
          <GuideTabs tabs={guideTabs} />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 lg:py-[100px]">
        <div className="container">
          <h2 className="mb-3 text-center text-3xl font-bold text-bs-dark sm:text-4xl lg:text-[3rem]">
            Frequently Asked Questions
          </h2>
          <Faq items={nriCornerFaqs} variant="guideline" className="mx-auto mt-8 max-w-4xl" />
        </div>
      </section>

      {/* Get in Touch — live `.nri-contact-section` #0b0b0b */}
      <section id="contact-nri" className="bg-nri-contact py-20 text-white">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h6 className="text-sm uppercase tracking-[2px] text-primary-gold">Get in Touch</h6>
              <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.2]">
                Start Your Investment Journey
              </h2>
              <p className="mt-6 mb-12 text-white/50">
                Our dedicated NRI desk provides end-to-end support, from property selection to
                legal due diligence and post-purchase management.
              </p>
              <div className="mb-6 flex items-center gap-3">
                <i className="fas fa-envelope text-2xl text-primary-gold" aria-hidden="true" />
                <div>
                  <h5 className="text-xl font-bold text-white">Email Us</h5>
                  <p className="text-white/50">marketing@eliteproinfra.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-2xl text-primary-gold" aria-hidden="true" />
                <div>
                  <h5 className="text-xl font-bold text-white">WhatsApp Support</h5>
                  <p className="text-white/50">+91 9968686868</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <NriCallbackForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
