import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import HeroVideo from "@/components/home/HeroVideo";
import CompactFeatureCard from "@/components/home/CompactFeatureCard";
import StatIconCard from "@/components/home/StatIconCard";
import SignatureProjectsGrid from "@/components/home/SignatureProjectsGrid";
import AwardsCarousel from "@/components/home/AwardsCarousel";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import InsightsHubTabs from "@/components/home/InsightsHubTabs";
import HomeEnquiryForm from "@/components/home/HomeEnquiryForm";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import InstagramReels from "@/components/home/InstagramReels";
import Faq from "@/components/home/Faq";
import { getAwards } from "@/lib/content/awards";
import { getInsightsHub } from "@/lib/content/insightsHub";
import { getSignatureProjects } from "@/lib/content/properties";
import { hero } from "@/lib/data/hero";
import { services } from "@/lib/data/services";
import { nriServices } from "@/lib/data/nri";

import { partners } from "@/lib/data/partners";
import { presenceBanners } from "@/lib/data/presence";

import { reviews, googleRating } from "@/lib/data/reviews";
import { socialLinks } from "@/lib/data/social";
import { homeFaqs } from "@/lib/data/faq";
import { whyChooseStats, transactionStats } from "@/lib/data/stats";

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

// Rendered widths for `fill` images, derived from this project's Bootstrap-style
// `.container` steps (540/720/960/1140/1320 with 24px side padding). Without a
// `sizes` the browser assumes 100vw and pulls a needlessly large file.
/** Half of a `.container` two-column `lg:grid-cols-2` row with `gap-12` (48px). */
const HALF_ROW_LG_SIZES =
  "(max-width: 575px) 100vw, (max-width: 767px) 492px, (max-width: 991px) 672px, (max-width: 1199px) 432px, (max-width: 1399px) 522px, 612px";

const contactDetails = [
  { icon: "fas fa-phone", title: "Call Us", value: "+91 9968686868", href: "tel:+919968686868" },
  {
    icon: "fas fa-envelope",
    title: "Email Us",
    value: "info@eliteproinfra.com",
    href: "mailto:info@eliteproinfra.com",
  },
  {
    icon: "fas fa-map-marker-alt",
    title: "Visit Us",
    value: "3rd Floor, Golf View Corporate Tower A, Golf Course Road, Sector 42, Gurgaon 122002",
  },
];

/*
 * Section backgrounds follow the live index.php top to bottom (values from its style.css
 * and inline styles): white / white / .why-choose radial / white / .stats-section /
 * white / #global image + rgba(10,10,10,.85) / white / white / .bg-light + gold dots /
 * #faq skyline + rgba(10,10,10,.85) / white / #contact dark gradient.
 */
export default async function Home() {
  const [signatureProjects, awards, insightsHub] = await Promise.all([
    getSignatureProjects(),
    getAwards(),
    getInsightsHub(),
  ]);

  return (
    <>
      <HeroVideo
        src={hero.video}
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        subheading={hero.subheading}
        align={hero.align}
      />

      {/* Who We Are */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal direction="right">
              {/* Live `.about-image-frame::before`: a 2px gold frame offset 12px outside the photo. */}
              <div className="relative m-3 before:absolute before:-inset-3 before:border-2 before:border-primary-gold before:content-['']">
                <Image
                  src="/images/team-image.jpeg"
                  alt="The ElitePro Infra team"
                  width={800}
                  height={550}
                  className="relative h-auto w-full object-cover shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
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
              <div className="mt-5 space-y-4 text-muted">
                <p>
                  At ElitePro Infra, we believe real estate is more than just transaction it&rsquo;s
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

      {/* Latest Instagram Reels (not on the live site; keeps the project's dark treatment) */}
      <InstagramReels />

      {/* Signature Projects */}
      <section className="bg-white py-20">
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
      <section className="bg-why-choose py-16 md:py-20">
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
              <p className="mt-5 text-muted">
                Comprehensive Real Estate Solutions Tailored for You.
              </p>
              <p className="mt-3 text-muted">
                We provide a full spectrum of services from residential sales to commercial
                leasing, ensuring every aspect of your real estate journey is covered with
                professionalism, transparency, and integrity. Partner with us for a seamless
                experience.
              </p>
              <Button href="/contact" variant="dark" iconRight="fas fa-arrow-right" className="mt-6">
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
      <section className="bg-stats-section py-14 text-white">
        <div className="container grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {transactionStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-primary-gold sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-white sm:text-base">{stat.label}</p>
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
        </div>
        {/*
          Deliberately outside the container: these are 16:9 banners that carry
          their own titling, and boxing them into a column would letterbox them
          into a strip with the lettering too small to read. The heading and
          copy stay in the container around them.
        */}
        <div className="space-y-12">
          {presenceBanners.map((banner, index) => (
            <Reveal key={banner.image} delay={delaySequence[index % delaySequence.length]}>
              <figure>
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  width={1600}
                  height={900}
                  sizes="100vw"
                  className="h-auto w-full"
                />
                <figcaption className="container mt-6 text-center">
                  <h3 className="text-xl font-bold text-dark-black">{banner.title}</h3>
                  <p className="mx-auto mt-2 max-w-3xl text-sm text-muted">{banner.description}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/*
        A "Global Opportunities" section of India/Dubai photo cards used to sit here. The
        footprint banners above now carry the international story, so it was dropped rather
        than left commented out — git history has it if it is ever wanted back.
      */}

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
      <section className="bg-white py-20">
        <div className="container">
          {/* Live: `OUR <span class="text-gold">AWARDS</span>` over a 60x3 separator, then the h2. */}
          <div className="mb-12 text-center">
            <h4 className="mb-2 text-lg font-bold uppercase tracking-[2px] text-dark-black">
              Our <span className="text-primary-gold">Awards</span>
            </h4>
            <div className="mx-auto h-[3px] w-[60px] bg-primary-gold" />
            <h2 className="mt-3 text-3xl font-bold text-dark-black sm:text-[2.2rem]">
              Recognized Excellence in Real Estate
            </h2>
          </div>
          <AwardsCarousel awards={awards} />
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
      <section id="nri" className="relative overflow-hidden bg-bs-light py-20">
        <div className="absolute inset-0 bg-gold-dots opacity-10" aria-hidden="true" />
        <div className="container relative z-[1]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal direction="right">
              <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
                Global Citizens
              </p>
              <h2 className="mt-2 text-3xl font-bold text-bs-dark sm:text-4xl">
                NRI Investment Services
              </h2>
              <div className="mt-4 h-1 w-20 bg-primary-gold" />
              <p className="mt-5 text-lg text-bs-muted">
                Seamless real estate investment solutions designed exclusively for Non-Resident
                Indians seeking to build wealth in India.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nriServices.map((item, index) => (
                  <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                    <CompactFeatureCard {...item} variant="nri" />
                  </Reveal>
                ))}
              </div>
              <Button
                href="/nri-corner"
                iconRight="fas fa-arrow-right"
                className="mt-8 rounded-full px-12 shadow-bs-sm"
              >
                Schedule a Consultation
              </Button>
            </Reveal>
            <Reveal direction="left" className="relative">
              <div className="relative z-[2] h-[420px] w-full overflow-hidden rounded-2xl shadow-bs-lg">
                <Image
                  src="/images/secure-ecosystem.webp"
                  alt="Premium residence serving NRI investors worldwide"
                  fill
                  sizes={HALF_ROW_LG_SIZES}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-60% to-black/60" />
              </div>
              {/* Live `.floating-badge`: white, Bootstrap `.shadow`, 4px #ffc107 left border. */}
              <div className="absolute -left-3 bottom-6 z-[3] hidden items-center gap-3 rounded-lg border-l-4 border-bs-warning bg-white p-4 shadow-bs md:flex">
                <i className="fas fa-globe text-[2.5rem] text-primary-gold" aria-hidden="true" />
                <div>
                  <p className="font-bold text-bs-dark">Global Reach</p>
                  <p className="text-sm text-bs-muted">Serving clients worldwide</p>
                </div>
              </div>
              <svg
                className="absolute -right-4 top-0 z-[1] -translate-y-1/2 opacity-25"
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="100" cy="100" r="100" fill="#D4AF37" />
              </svg>
              <svg
                className="absolute -bottom-4 right-0 z-[1] -translate-x-1/2 opacity-25"
                width="150"
                height="150"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <rect x="0" y="0" width="200" height="200" rx="20" fill="#D4AF37" />
              </svg>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-faq-section py-20 text-white">
        <div className="absolute inset-0 bg-overlay-dark" aria-hidden="true" />
        <div className="container relative z-[1]">
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
            <p className="mt-2 text-muted">What our clients say about us</p>
          </div>
          {/* Live `.google-reviews-header`: white, 12px radius, 0 5px 20px rgba(0,0,0,.05). */}
          <div className="mb-10 flex flex-col items-center justify-between gap-6 rounded-xl bg-white px-[30px] py-[25px] shadow-card sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-[3.5rem] font-bold leading-none text-muted-5">
                {googleRating.score.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5 text-[1.2rem] text-google-star" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <i key={index} className="fas fa-star" />
                  ))}
                </div>
                <p className="text-[0.95rem] text-muted">{googleRating.count} reviews on Google</p>
              </div>
            </div>
            <a
              href="https://www.google.com/search?q=elitepro+infra+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-google-blue px-[30px] py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-google-blue-hover hover:shadow-[0_5px_15px_rgba(26,115,232,0.3)]"
            >
              <i className="fab fa-google" aria-hidden="true" />
              Review us on Google
            </a>
          </div>
          <ReviewsCarousel reviews={reviews} />
        </div>
      </section>

      {/* Contact CTA — live `#contact`: dark gradient section, frosted rgba(255,255,255,.03)
          panel, gold-gradient info side with white icon circles, white form side. */}
      <section className="relative overflow-hidden bg-dark-gradient py-20 text-white">
        <i
          className="far fa-building absolute right-0 top-0 hidden p-12 text-[10em] text-white opacity-10 lg:block"
          aria-hidden="true"
        />
        <div className="container relative z-[1]">
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] shadow-bs-lg backdrop-blur-[10px] lg:grid-cols-12">
            <div className="relative overflow-hidden bg-primary-gold p-12 text-white lg:col-span-5">
              <div className="absolute inset-0 bg-gold-panel" aria-hidden="true" />
              <i
                className="fas fa-comments absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] text-[10em] text-white opacity-25"
                aria-hidden="true"
              />
              <div className="relative z-[1] flex h-full flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
                  <p className="mt-4 opacity-90">
                    Ready to start your real estate journey? Our team of experts is here to guide
                    you through every step.
                  </p>
                  <ul className="mt-10 space-y-6">
                    {contactDetails.map((detail) => (
                      <li key={detail.title} className="flex items-start gap-3">
                        <span className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-white text-primary-gold shadow-bs-sm">
                          <i className={detail.icon} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-bold text-white">{detail.title}</p>
                          {detail.href ? (
                            <a href={detail.href} className="text-sm text-white opacity-90">
                              {detail.value}
                            </a>
                          ) : (
                            <p className="text-sm opacity-90">{detail.value}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 border-t border-white/20 pt-6">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-[2px] text-white">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="text-lg text-white transition-transform hover:scale-110"
                      >
                        <i className={social.icon} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 text-dark-black lg:col-span-7 lg:p-12">
              <h3 className="text-2xl font-bold text-dark-black">Send us a Message</h3>
              <p className="mt-2 text-bs-muted">
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
