import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import IconBadge from "@/components/ui/IconBadge";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import PMFeatureCard from "@/components/property-management/PMFeatureCard";
import PMLeadForm from "@/components/property-management/PMLeadForm";
import PMTestimonialCard from "@/components/property-management/PMTestimonialCard";
import ProcessStep from "@/components/property-management/ProcessStep";
import { propertyManagementStats } from "@/lib/data/stats";
import { propertyManagementTestimonials } from "@/lib/data/testimonials";
import { pmServices, processSteps, whyChooseUsFeatures } from "@/lib/data/propertyManagement";

export const metadata: Metadata = {
  title: "Property Management",
  description:
    "Your Property. Our Priority. White-glove property management services designed to maximize your ROI while ensuring complete peace of mind.",
};

const serviceDelays = [100, 200, 300, 400, 500, 600] as const;

export default function PropertyManagementPage() {
  return (
    <>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-dark-black bg-[url('/images/heroes/property-management.jpg')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="container relative z-10">
          <div className="max-w-2xl border-l-4 border-primary-gold pl-6 sm:pl-10">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Property Management
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Your Property. <span className="text-primary-gold">Our Priority.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              White-glove property management services designed to maximize your ROI while
              ensuring complete peace of mind.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#list-property">List Your Property</Button>
              <Button href="#services" variant="outline-light">
                Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-black py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {propertyManagementStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold leading-none text-primary-gold sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm uppercase tracking-wide text-white/70 sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal direction="right">
              <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
                Why Choose Us
              </p>
              <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
                Why Owners Trust Us?
              </h2>
              <p className="mt-5 text-neutral-500">
                We bring institutional-grade management to every property, ensuring maximum
                returns with minimum hassle.
              </p>
            </Reveal>
            <Reveal direction="left">
              <div className="grid grid-cols-2 gap-4">
                {whyChooseUsFeatures.map((feature) => (
                  <div key={feature.title} className="rounded-xl bg-white p-6 text-center shadow-sm">
                    <IconBadge icon={feature.icon} variant="tinted" className="mx-auto mb-3" />
                    <h4 className="font-bold text-dark-black">{feature.title}</h4>
                    <p className="mt-1 text-sm text-neutral-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Full-Spectrum Management"
            title="Comprehensive Property Solutions"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pmServices.map((service, index) => (
              <Reveal key={service.title} delay={serviceDelays[index % serviceDelays.length]}>
                <PMFeatureCard {...service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f0f0f] py-20 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <Reveal direction="right">
                <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
                  How We Work
                </p>
                <h2 className="mt-2 mb-10 text-3xl font-bold text-white sm:text-4xl">
                  Simple 4-Step Process
                </h2>
              </Reveal>
              {processSteps.map((step) => (
                <ProcessStep key={step.number} {...step} />
              ))}
            </div>
            <Reveal direction="left" className="hidden lg:block">
              <Image
                src="/images/team-image.jpeg"
                alt="The Elite Pro Infraventure property management team"
                width={800}
                height={900}
                className="h-full w-full rounded-2xl object-cover opacity-75"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Client Stories" title="What Owners Say" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {propertyManagementTestimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={((index + 1) * 100) as 100 | 200 | 300}>
                <PMTestimonialCard {...testimonial} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="list-property" className="bg-white py-20">
        <div className="container">
          <Reveal
            direction="up"
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-light-black to-black p-10 text-center md:p-16"
          >
            <div className="pointer-events-none absolute -right-24 -top-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Maximize Your Rental Yield?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
                Get a free rental assessment and find out how much your property can earn.
              </p>
              <div className="mx-auto mt-10 max-w-2xl">
                <PMLeadForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
