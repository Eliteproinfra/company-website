import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import HeroCarousel from "@/components/home/HeroCarousel";
import CompactFeatureCard from "@/components/home/CompactFeatureCard";
import StatIconCard from "@/components/home/StatIconCard";
import SignatureProjectsGrid from "@/components/home/SignatureProjectsGrid";
import AwardsCarousel from "@/components/home/AwardsCarousel";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import InsightsHubTabs from "@/components/home/InsightsHubTabs";
import HomeEnquiryForm from "@/components/home/HomeEnquiryForm";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import Faq from "@/components/home/Faq";
import { heroSlides, heroSlidesMobile } from "@/lib/data/heroSlides";
import { services } from "@/lib/data/services";
import { nriServices } from "@/lib/data/nri";
import { signatureProjects } from "@/lib/data/signatureProjects";
import { insightsHub } from "@/lib/data/insightsHub";
import { partners } from "@/lib/data/partners";
import { awardImages } from "@/lib/data/awards";
import { reviews, googleRating } from "@/lib/data/reviews";
import { socialLinks } from "@/lib/data/social";
import { homeFaqs } from "@/lib/data/faq";
import { whyChooseStats, transactionStats } from "@/lib/data/stats";

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function Home() {
  return (
    <>
      <HeroCarousel slides={heroSlides} mobileSlides={heroSlidesMobile} />

      {/* Who We Are */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal direction="right">
              <div className="overflow-hidden rounded-2xl border-2 border-primary-gold p-2">
                <Image
                  src="/images/team-image.jpeg"
                  alt="The ElitePro Infra team"
                  width={800}
                  height={550}
                  className="h-auto w-full rounded-xl object-cover"
                />
              </div>
            </Reveal>
            <Reveal direction="left">
              <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
                Who We Are
              </p>
              <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
                Advisory Beyond Property We Build Legacies
              </h2>
              <div className="mt-5 space-y-4 text-neutral-500">
                <p>
                  At ElitePro Infra, we believe real estate is more than just transaction it’s
                  about building wealth, elevating lifestyles, and creating enduring value.
                </p>
                <p>
                  Since our inception in 2012, we have evolved into one of India&apos;s leading
                  real estate advisory firms, offering a seamless platform for residential,
                  commercial, and investment-focused solutions. With a client-first approach and
                  data-driven insights, we have guided thousands of investors, homebuyers, and
                  businesses toward the most profitable and secure opportunities.
                </p>
                <p>
                  To date, we&apos;ve successfully facilitated sales across 55 million sq. ft. of
                  premium real estate, serving a community of 30,000+ satisfied clients. Our
                  strength lies in delivering curated opportunities, transparent processes, and
                  comprehensive support from discovery and due diligence to acquisition and
                  after-sales assistance.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Signature Projects */}
      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading
            title="Signature Projects"
            description="Explore marquee projects across major cities."
          />
          <SignatureProjectsGrid projects={signatureProjects} />
          <div className="mt-12 text-center">
            <Button href="/properties">View More</Button>
          </div>
        </div>
      </section>

      {/* Insights Hub */}
      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading
            title="Insights Hub"
            description="Stay informed with updates, stories, and recognitions."
          />
          <InsightsHubTabs categories={insightsHub} />
        </div>
      </section>

      {/* Why Choose Elite Pro? */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="container">
          <SectionHeading
            title="Why Choose Elite Pro?"
            description="Premium expertise backed by scale and trusted relationships."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseStats.map((stat, index) => (
              <Reveal key={stat.label} delay={delaySequence[index % delaySequence.length]}>
                <StatIconCard {...stat} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section id="services" className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal direction="right" className="lg:col-span-4">
              <h2 className="text-3xl font-bold text-dark-black sm:text-4xl">Our Expertise</h2>
              <p className="mt-5 font-semibold text-dark-black">
                Comprehensive Real Estate Solutions Tailored for You.
              </p>
              <p className="mt-3 text-neutral-500">
                We provide a full spectrum of services from residential sales to commercial
                leasing, ensuring every aspect of your real estate journey is covered with
                professionalism, transparency, and integrity. Partner with us for a seamless
                experience.
              </p>
              <Button href="/contact" variant="outline" className="mt-6">
                Get Consultation
              </Button>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
              {services.map((service, index) => (
                <Reveal key={service.title} delay={delaySequence[index % delaySequence.length]}>
                  <CompactFeatureCard {...service} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Stats */}
      <section className="relative overflow-hidden bg-dark-black py-14">
        <Image
          src="/images/skyline.webp"
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-30"
        />
        <div className="container relative grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {transactionStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-primary-gold sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-white/70 sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nationwide & Global Reach */}
      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Our Footprint"
            title="Nationwide & Global Reach"
            description="Extending our reach across India and key global markets through reliable partners and strategic alliances."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal direction="right">
              <div className="overflow-hidden rounded-2xl bg-dark-black">
                <Image
                  src="/images/2.png"
                  alt="Map of ElitePro Infra's presence across India"
                  width={800}
                  height={340}
                  style={{ objectPosition: "62% 45%" }}
                  className="h-[340px] w-full scale-[2.6] object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-dark-black">Pan-India Presence</h3>
                <p className="mt-2 text-sm text-neutral-500">
                  We actively operate across 20+ major cities in India, supported by a strong
                  regional partner and execution network to ensure seamless service delivery
                  nationwide.
                </p>
              </div>
            </Reveal>
            <Reveal direction="left">
              <div className="overflow-hidden rounded-2xl bg-dark-black">
                <Image
                  src="/images/2.png"
                  alt="Map of ElitePro Infra's global office locations"
                  width={800}
                  height={340}
                  style={{ objectPosition: "50% 68%" }}
                  className="h-[340px] w-full scale-[1.35] object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-dark-black">Global Presence</h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Our footprint extends across key international markets, enabling us to serve
                  global clients through strategic alliances and trusted international partners.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Global Opportunities */}
      <section className="relative overflow-hidden bg-dark-black py-20">
        <div className="container relative">
          <SectionHeading
            title="Global Opportunities"
            description="Invest in the world's finest destinations"
            dark
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { name: "India", image: "/images/global-india.jpg", href: "/properties" },
              { name: "Dubai", image: "/images/global-dubai.png", href: "/nri-corner" },
            ].map((place, index) => (
              <Reveal key={place.name} delay={delaySequence[index % delaySequence.length]}>
                <Link
                  href={place.href}
                  className="group relative block h-[320px] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={place.image}
                    alt={`${place.name} skyline`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute bottom-5 left-5 text-2xl font-bold text-white">
                    {place.name}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/nri-corner" variant="outline-light">
              Explore International
            </Button>
          </div>
        </div>
      </section>

      {/* Elite Developer Partners */}
      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading
            title="Elite Developer Partners"
            description="Collaborating with the industry's finest A+ developers"
          />
          <PartnersMarquee partners={partners} />
        </div>
      </section>

      {/* Awards */}
      <section className="bg-neutral-50 py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Our Awards"
            title="Recognized Excellence in Real Estate"
          />
          <AwardsCarousel images={awardImages} />
          <div className="mt-10 text-center">
            <Link
              href="/awards"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-gold"
            >
              View All Awards <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* NRI Investment Services */}
      <section id="nri" className="bg-neutral-50 py-20">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal direction="right">
              <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
                Global Citizens
              </p>
              <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">
                NRI Investment Services
              </h2>
              <p className="mt-5 text-neutral-500">
                Seamless real estate investment solutions designed exclusively for Non-Resident
                Indians seeking to build wealth in India.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nriServices.map((item, index) => (
                  <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                    <CompactFeatureCard {...item} />
                  </Reveal>
                ))}
              </div>
              <Button href="/nri-corner" className="mt-8">
                Schedule a Consultation
              </Button>
            </Reveal>
            <Reveal direction="left" className="relative">
              <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/secure-ecosystem.webp"
                  alt="Premium residence serving NRI investors worldwide"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-gold/10 text-primary-gold">
                  <i className="fas fa-globe" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-dark-black">Global Reach</p>
                  <p className="text-sm text-neutral-500">Serving clients worldwide</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-dark-black py-20">
        <Image
          src="/images/banner-4.png"
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-20"
        />
        <div className="container relative">
          <SectionHeading
            title="Frequently Asked Questions"
            description="Common queries about real estate investment"
            dark
          />
          <Faq items={homeFaqs} dark />
        </div>
      </section>

      {/* Google Reviews */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-dark-black sm:text-4xl">Google Reviews</h2>
            <p className="mt-2 text-neutral-500">What our clients say about us</p>
          </div>
          <div className="mb-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-neutral-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-dark-black">
                {googleRating.score.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5 text-primary-gold" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <i key={index} className="fas fa-star" />
                  ))}
                </div>
                <p className="text-sm text-neutral-500">{googleRating.count} reviews on Google</p>
              </div>
            </div>
            <a
              href="https://www.google.com/search?q=elitepro+infra+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1558b3]"
            >
              <i className="fab fa-google" aria-hidden="true" />
              Review us on Google
            </a>
          </div>
          <ReviewsCarousel reviews={reviews} />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-neutral-50 py-20">
        <div className="container">
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] lg:grid-cols-12">
            <div className="bg-gradient-to-br from-primary-gold to-secondary-gold p-10 text-[#1a1200] lg:col-span-5 lg:p-12">
              <h2 className="text-3xl font-bold">Get in Touch</h2>
              <p className="mt-4 text-[#1a1200]/80">
                Ready to start your real estate journey? Our team of experts is here to guide you
                through every step.
              </p>
              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-3">
                  <i className="fas fa-phone mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-bold">Call Us</p>
                    <a href="tel:+919968686868" className="text-sm">
                      +91 9968686868
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-envelope mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-bold">Email Us</p>
                    <a href="mailto:info@eliteproinfra.com" className="text-sm">
                      info@eliteproinfra.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-bold">Visit Us</p>
                    <p className="text-sm">
                      3rd Floor, Golf View Corporate Tower A, Golf Course Road, Sector 42, Gurgaon
                      122002
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-10 border-t border-[#1a1200]/20 pt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[2px]">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-lg transition-transform hover:scale-110"
                    >
                      <i className={social.icon} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white p-10 lg:col-span-7 lg:p-12">
              <h3 className="text-2xl font-bold text-dark-black">Send us a Message</h3>
              <p className="mt-2 text-neutral-500">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>
              <HomeEnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
