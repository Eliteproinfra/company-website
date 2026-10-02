import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import JobOpenings from "@/components/careers/JobOpenings";
import { jobListings, cultureHighlights, careerGallery } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Our Talent Community — Where Excellence Meets Opportunity. Build a career that defines the future of real estate.",
};

const delaySequence = [0, 100, 200, 300] as const;

function jobPostingSchema(job: (typeof jobListings)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: new Date().toISOString().slice(0, 10),
    employmentType: job.type.toUpperCase().replace(" ", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: "Elite Pro Infraventure",
      sameAs: "https://eliteproinfra.com",
      logo: "https://eliteproinfra.com/images/Elite-pro-logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressRegion: "Haryana",
        addressCountry: "IN",
      },
    },
    experienceRequirements: job.experience,
  };
}

/*
 * Live career.php: .career-hero (.5 -> .8, centred, 60vh, one .btn-gold), white
 * "Redefining Work Culture" (.talent-card), white .hiring-box quote, .bg-light
 * "Life at Elite Pro Infra" gallery, white #openings (departments + job accordion),
 * .bg-light "Didn't find a role" strip with .btn-outline-dark.
 */
export default function CareersPage() {
  return (
    <>
      {jobListings.map((job) => (
        <script
          key={job.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema(job)) }}
        />
      ))}

      <header className="relative flex h-[60vh] items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.8)),url('/images/bg/career-team.jpg')] bg-cover bg-center text-center text-white">
        <div className="container max-w-[850px]">
          <h1 className="text-[35px] font-bold [text-shadow:2px_2px_10px_rgba(0,0,0,0.5)]">
            Join Our Talent Community
          </h1>
          <p className="mx-auto mt-5 mb-8 text-lg text-white/50">
            Where Excellence Meets Opportunity. Build a career that defines the future of real
            estate.
          </p>
          <Button href="#openings">View Openings</Button>
        </div>
      </header>

      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h5 className="text-lg uppercase tracking-[2px] text-primary-gold">Why Elite Pro?</h5>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl">Redefining Work Culture</h2>
            <div className="mx-auto mt-3 h-[3px] w-[60px] bg-primary-gold" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cultureHighlights.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                {/* Live `.talent-card`: white, 1px #f0f0f0, 15px radius, 0 10px 30px rgba(0,0,0,.05);
                    gold top bar scales in and the #fff8e1 icon circle fills gold on hover. */}
                <div className="group relative h-full overflow-hidden rounded-[15px] border border-border-soft bg-white px-[30px] py-10 text-center shadow-card-lg transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:bg-primary-gold before:transition-transform before:duration-300 before:content-[''] hover:-translate-y-2.5 hover:shadow-card-hover hover:before:scale-x-100">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-tint text-[2rem] text-primary-gold transition-all duration-300 group-hover:bg-primary-gold group-hover:text-white">
                    <i className={item.icon} aria-hidden="true" />
                  </div>
                  <h5 className="text-xl font-bold text-dark-black">{item.title}</h5>
                  <p className="mt-2 text-sm text-bs-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          {/* Live `.hiring-box`: gold gradient, 20px radius, white copy, faint serif quote mark. */}
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[20px] bg-gold-gradient p-10 text-center text-white sm:p-[60px]">
            <span aria-hidden="true" className="absolute right-10 top-5 font-serif text-[15rem] leading-none opacity-10">
              &rdquo;
            </span>
            <i className="fas fa-quote-left mb-6 text-5xl text-white/50" aria-hidden="true" />
            <h3 className="mb-6 text-2xl font-bold text-white sm:text-[1.75rem]">
              &ldquo;Elite Pro Infra isn&apos;t just a workplace - it&apos;s a launchpad for ambitious
              minds. Here, every step in your career is guided, celebrated, and elevated.&rdquo;
            </h3>
            <p className="font-bold text-white">&ndash; Head of HR, Elite Pro Infra</p>
          </div>
        </div>
      </section>

      <section className="bg-bs-light py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-dark-black sm:text-4xl">Life at Elite Pro Infra</h2>
            <p className="mt-2 text-bs-muted">Grow beyond your goals. Build lifelong relationships.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {careerGallery.map((item) => (
              // Live `.gallery-item`: 250px, 10px radius, image scales 1.1 and the caption slides up on hover.
              <div key={item.image} className="group relative h-[250px] cursor-pointer overflow-hidden rounded-[10px]">
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 576px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 -bottom-[50px] bg-linear-to-b from-transparent to-black/80 p-[15px] text-white transition-[bottom] duration-300 group-hover:bottom-0">
                  <h6 className="font-bold">{item.caption}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="openings" className="bg-white py-20">
        <div className="container">
          <JobOpenings jobs={jobListings} />
        </div>
      </section>

      <section className="bg-bs-light py-20">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <h3 className="text-2xl font-bold text-dark-black">
                Didn&apos;t find a role that aligns with your profile?
              </h3>
              <p className="mt-2 text-bs-muted">
                We are always on the lookout for driven and talented professionals. Send us your
                resume hr@eliteproinfra.com and we&apos;ll connect when an opportunity arises.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Button href="mailto:HR@eliteproinfra.com" variant="dark" className="px-6 py-4">
                Email Your Resume
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
