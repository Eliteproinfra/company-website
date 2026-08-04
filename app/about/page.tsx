import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import IconBadge from "@/components/ui/IconBadge";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import VisionMissionCard from "@/components/about/VisionMissionCard";
import ProcessStep from "@/components/property-management/ProcessStep";

export const metadata: Metadata = {
  title: "Our Story & Journey",
  description:
    "More Than Just Real Estate — 14 years of excellence, one trusted name. Discover Elite Pro Infraventure's journey, mission, vision, and core values.",
};

const essence = [
  { icon: "fas fa-handshake", title: "Trusted Partners" },
  { icon: "fas fa-trophy", title: "Award Winning" },
  { icon: "fas fa-heart", title: "Client-First Approach" },
  { icon: "fas fa-chart-line", title: "Market Expertise" },
];

const timeline = [
  {
    number: "2013",
    title: "Inception",
    description: "Founded to organize the unorganized real estate sector.",
  },
  {
    number: "2018",
    title: "Expansion",
    description: "Grew across Gurugram and NCR.",
  },
  {
    number: "2021",
    title: "Recognition",
    description: "Named “Best Emerging Real Estate Consultant.”",
  },
  {
    number: "2024",
    title: "Global Reach",
    description: "Launched dedicated NRI services.",
  },
];

const visionMission = [
  {
    icon: "fas fa-bullseye",
    title: "Our Mission",
    description:
      "To deliver precise, insight-led, and experience-driven solutions with transparency and end-to-end support.",
  },
  {
    icon: "fas fa-eye",
    title: "Our Vision",
    description:
      "To become the undisputed leader in luxury real estate consultancy, with global standards and sustainable growth.",
  },
];

const coreValues = [
  { icon: "fas fa-shield-halved", title: "Integrity" },
  { icon: "fas fa-award", title: "Excellence" },
  { icon: "fas fa-lightbulb", title: "Innovation" },
  { icon: "fas fa-users", title: "Client Focus" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/heroes/about.webp"
        title="More Than Just Real Estate"
        breadcrumbCurrent="About Us"
      />

      {/* Company Essence */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Who We Are
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              Every Transaction, A New Chapter
            </h2>
            <p className="mt-5 text-neutral-500">
              For Elite Pro Infraventure, every property transaction is the beginning of a new
              chapter &mdash; not just a deal. That belief shapes how we work with every client,
              every day.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {essence.map((item) => (
              <div key={item.title} className="group text-center">
                <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-3" />
                <p className="font-semibold text-dark-black">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="Our Journey" title="14 Years of Excellence. One Trusted Name." />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-10 gap-y-2 rounded-3xl bg-dark-black p-8 sm:grid-cols-2 sm:p-12">
            {timeline.map((step) => (
              <ProcessStep key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visionMission.map((item, index) => (
              <Reveal key={item.title} delay={index === 0 ? 0 : 100}>
                <VisionMissionCard {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading eyebrow="What Drives Us" title="Core Values" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {coreValues.map((item) => (
              <div key={item.title} className="group text-center">
                <IconBadge icon={item.icon} variant="tinted" className="mx-auto mb-3" />
                <p className="font-semibold text-dark-black">{item.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button href="/leadership">Meet Our Leadership</Button>
          </div>
        </div>
      </section>
    </>
  );
}
