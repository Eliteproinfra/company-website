import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import VisionMissionCard from "@/components/about/VisionMissionCard";
import AboutHero from "@/components/about/AboutHero";
import EssenceCard from "@/components/about/EssenceCard";
import JourneyTimeline from "@/components/about/JourneyTimeline";
import { leaders } from "@/lib/data/leadership";

export const metadata: Metadata = {
  title: "Our Story & Journey",
  description:
    "More Than Just Real Estate — 14 years of excellence, one trusted name. Discover Elite Pro Infraventure's journey, mission, vision, and core values.",
};

const essence = [
  {
    icon: "fas fa-handshake",
    title: "Trusted Partners",
    description: "Building relationships that last.",
  },
  {
    icon: "fas fa-award",
    title: "Award Winning",
    description: "Recognized for excellence.",
  },
  {
    icon: "fas fa-users",
    title: "Client-First Approach",
    description: "Your goals guide every decision.",
  },
  {
    icon: "fas fa-chart-line",
    title: "Market Expertise",
    description: "Insight driven, future focused.",
  },
];

const timeline = [
  {
    year: "2013",
    icon: "fas fa-lightbulb",
    title: "Inception",
    description:
      "Elite Pro Infra was founded with a vision to organize the unorganized real estate sector.",
  },
  {
    year: "2018",
    icon: "fas fa-chart-line",
    title: "Rapid Expansion",
    description:
      "Expanded operations across Gurugram and NCR, partnering with top-tier developers.",
  },
  {
    year: "2021",
    icon: "fas fa-trophy",
    title: "Award Recognition",
    description:
      "Recognized as “Best Emerging Real Estate Consultant” for outstanding client service.",
  },
  {
    year: "2024",
    icon: "fas fa-globe",
    title: "Global Reach",
    description: "Launched NRI services and digital platforms to serve a global clientele.",
  },
  {
    year: "2026",
    icon: "fas fa-building",
    title: "14 Years of Excellence. One Trusted Name.",
    description:
      "From a single vision to a global presence, we’ve delivered thousands of successful transactions and ₹1 Lakh Cr+ in property value. We build lasting relationships and create real wealth.",
  },
];

const visionMission = [
  {
    icon: "fas fa-bullseye",
    title: "Our Mission",
    description:
      "To revolutionize real estate advisory in India by delivering precise, insight-led, and experience-driven solutions. We aim to empower every client with clarity, confidence, and curated opportunities.",
    points: ["Client-First Approach", "Transparent Dealings", "End-to-End Support"],
  },
  {
    icon: "fas fa-eye",
    title: "Our Vision",
    description:
      "To be the undisputed leader in luxury real estate consultancy, setting global benchmarks for professionalism and integrity. We envision a future where every investment we guide creates lasting wealth and legacy.",
    points: ["Global Standards", "Innovation in Service", "Sustainable Growth"],
  },
];

const coreValues = [
  {
    icon: "fas fa-shield-halved",
    title: "Integrity",
    description: "We uphold the highest standards of honesty in every transaction.",
  },
  {
    icon: "fas fa-award",
    title: "Excellence",
    description: "Delivering premium quality and exceeding expectations is our norm.",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Innovation",
    description: "Embracing new technologies to enhance the real estate experience.",
  },
  {
    icon: "fas fa-users",
    title: "Client Focus",
    description: "Your dreams and goals are at the heart of everything we do.",
  },
];

/*
 * Section backgrounds follow live our-story.php, except the timeline, which is now a
 * dark panel of its own: intro white, timeline dark skyline,
 * mission .bg-dark-black (gold radial to #111827 + greyscale skyline + .8->.9 overlay),
 * values white, closing CTA .bg-gold with a Bootstrap .btn-dark.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* Our Essence */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
              Our Essence
            </p>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
              More Than Just Real Estate
            </h2>
            <p className="mt-5 text-muted">
              We believe that every property transaction is the beginning of a new chapter. Our
              story is written in the satisfaction of our clients and the skylines we help shape.
            </p>
            <p className="mt-4 text-muted">
              Elite Pro Infra stands as a beacon of trust in the Indian real estate market. With a
              deep understanding of property dynamics and a client-centric approach, we navigate
              the complexities of real estate to deliver seamless, profitable, and enduring
              solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {essence.map((item) => (
              <EssenceCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline — dark panel, the trail and its heading live in the component */}
      <JourneyTimeline steps={timeline} />

      {/* Mission & Vision — live `.story-mission.bg-dark-black` */}
      <section className="relative overflow-hidden bg-dark-radial py-20 text-white">
        <Image
          src="/images/skyline.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
          className="object-cover opacity-25 grayscale"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-black/80 to-black/90"
          aria-hidden="true"
        />
        <div className="container relative z-[1]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visionMission.map((item, index) => (
              <Reveal key={item.title} delay={index === 0 ? 0 : 100}>
                <VisionMissionCard {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading eyebrow="Our Leadership" title="The Force Behind The Vision" />
          <div className="space-y-16">
            {leaders.map((leader, index) => (
              <Reveal
                key={leader.name}
                direction={index % 2 === 0 ? "right" : "left"}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12"
              >
                <div
                  className={`relative h-[380px] overflow-hidden rounded-[10px] bg-copyright-bg shadow-[0_10px_30px_rgba(0,0,0,0.1)] lg:col-span-5 ${
                    index % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={leader.photo}
                    alt={leader.name}
                    fill
                    sizes="(min-width: 992px) 40vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="lg:col-span-7">
                  <h3 className="text-3xl font-bold text-bs-dark sm:text-4xl lg:text-[3rem]">{leader.name}</h3>
                  <div className="mb-3 mt-2 h-1 w-20 bg-primary-gold" />
                  <p className="font-semibold text-dark-black">{leader.title}</p>
                  {(leader.storyBio ?? [leader.bio]).map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mt-4 text-dark-black">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values — live `.value-card.bg-light.rounded-3.shadow-sm.border.transition-hover` */}
      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading title="Our Core Values" description="The pillars that uphold our legacy" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((item, index) => (
              <Reveal key={item.title} delay={index === 0 ? 0 : ((index * 100) as 100 | 200 | 300)}>
                <div className="h-full rounded-lg border border-bs-border bg-bs-light p-6 text-center shadow-bs-sm transition-all duration-300 hover:-translate-y-[5px] hover:bg-gold-tint hover:shadow-bs">
                  <i className={`${item.icon} mb-3 text-[2.5rem] text-primary-gold`} aria-hidden="true" />
                  <p className="font-bold text-dark-black">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — live `section.py-5.bg-gold.text-white` with `.btn-dark` */}
      <section className="bg-primary-gold py-16 text-center text-white">
        <div className="container">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Start Your Journey?</h2>
          <p className="mt-3 text-white">
            Let us guide you to your dream property with expertise and care.
          </p>
          <Button href="/contact" variant="bs-dark" className="mt-8">
            Get in Touch
          </Button>
        </div>
      </section>
    </>
  );
}
