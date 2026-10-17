import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

const storyParagraphs = [
  "Established in 2012, ElitePro Infra began with a clear vision: to make real estate more transparent, professional, and client-centric. What started as a vision has evolved into a comprehensive real estate advisory platform, connecting homebuyers, investors, businesses, and NRI clients with carefully selected property opportunities.",
  "Over the years, we have expanded our expertise across premium residential developments, commercial real estate, land acquisition, investment advisory, and property management. Our approach combines market intelligence, personalized guidance, and a commitment to building lasting relationships.",
];

const chapters = [
  {
    stage: "The Beginning",
    title: "A Vision Built on Trust",
    image: "/images/bg/nri-advisory.jpg",
    text: "Our journey began with a simple belief: real estate deserves a more transparent and organized approach. We set out to create a client-focused advisory experience where every property decision begins with understanding the client's needs, goals, and aspirations.",
  },
  {
    stage: "Expanding Our Expertise",
    title: "Growing with the Market",
    image: "/images/bg/skyline-towers.jpg",
    text: "As the real estate landscape evolved, so did we. We strengthened our presence across Gurugram and the wider Delhi-NCR region, building relationships with reputed developers and expanding our portfolio across residential, commercial, and investment-focused properties.",
  },
  {
    stage: "Strengthening Our Presence",
    title: "Beyond Property Deals",
    image: "/images/bg/career-team.jpg",
    text: "With a growing network and deeper market understanding, we continued to enhance our advisory capabilities. Our focus remained on helping clients evaluate opportunities, understand market dynamics, and navigate the property acquisition process with greater clarity and confidence.",
  },
  {
    stage: "A Broader Vision",
    title: "Connecting Markets and Investors",
    image: "/images/global-dubai.png",
    text: "Recognizing the growing demand for cross-border real estate opportunities, we expanded our reach through international relationships and NRI-focused advisory services. This broader outlook enables us to serve clients exploring property opportunities across India and selected international markets, including Dubai.",
  },
  {
    stage: "The Road Ahead",
    title: "Built for the Future",
    image: "/images/hero-skyline.png",
    text: "Today, ElitePro Infra continues to evolve with changing customer expectations, emerging investment opportunities, and advances in digital engagement. Our ambition is to create a more connected, informed, and seamless real estate experience while staying true to the values that define us.",
  },
];

const differentiators = [
  {
    icon: "fas fa-user-tie",
    title: "Client-First Advisory",
    text: "Every client has a different vision. We take the time to understand individual requirements and offer property options aligned with their lifestyle, investment objectives, and budget.",
  },
  {
    icon: "fas fa-chart-pie",
    title: "Market Intelligence & Insights",
    text: "We combine local market understanding with research-led insights to help clients assess locations, compare opportunities, and make informed property decisions.",
  },
  {
    icon: "fas fa-scale-balanced",
    title: "Transparency at Every Step",
    text: "We believe trust is built through honest communication, clear processes, and realistic expectations. Our approach is designed to help clients move forward with confidence.",
  },
  {
    icon: "fas fa-gem",
    title: "Curated Property Opportunities",
    text: "From premium residences and branded developments to commercial spaces, plots, and land opportunities, we help clients explore properties that align with their needs.",
  },
  {
    icon: "fas fa-route",
    title: "End-to-End Support",
    text: "Our relationship extends beyond property discovery. We assist clients through the key stages of their journey, from shortlisting and site visits to documentation assistance and post-purchase support, as applicable.",
  },
  {
    icon: "fas fa-globe",
    title: "A Growing National and Global Network",
    text: "Through our expanding network and strategic relationships, we aim to connect clients with relevant opportunities across major Indian markets and selected international destinations.",
  },
];

const purpose = [
  {
    icon: "fas fa-bullseye",
    title: "Our Mission",
    text: "To simplify real estate decisions through transparent advisory, market-driven insights, and personalized service—helping every client discover opportunities that align with their aspirations and long-term objectives.",
  },
  {
    icon: "fas fa-eye",
    title: "Our Vision",
    text: "To become a trusted name in premium real estate advisory, recognized for integrity, expertise, innovation, and an unwavering commitment to client success across India and international markets.",
  },
];

const values = [
  {
    icon: "fas fa-shield-halved",
    title: "Integrity",
    text: "We believe every successful relationship begins with honesty and ethical conduct.",
  },
  {
    icon: "fas fa-award",
    title: "Excellence",
    text: "We strive to deliver professional service and a consistently high-quality client experience.",
  },
  {
    icon: "fas fa-heart",
    title: "Client Commitment",
    text: "We put our clients' needs, aspirations, and objectives at the heart of every interaction.",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Innovation",
    text: "We embrace evolving technologies and market insights to improve the real estate advisory experience.",
  },
  {
    icon: "fas fa-handshake",
    title: "Long-Term Relationships",
    text: "We value lasting partnerships over short-term gains and believe trust is earned through consistent service.",
  },
];

const eyebrowClass = "text-sm font-bold uppercase tracking-[3px] text-primary-gold";
// Big hollow chapter numbers: transparent fill with a gold outline.
const outlineNumberClass =
  "font-serif font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(212,175,55,0.75)]";

/**
 * The /about "Our Story & Journey" block: story intro beside the team photo, a
 * five-chapter journey zig-zag with a photo per chapter, the differentiators,
 * mission/vision/values, and the closing promise with a contact CTA.
 */
export default function OurStory() {
  return (
    <>
      {/* Story intro */}
      <section className="overflow-hidden bg-white py-20 lg:py-28">
        <div className="container grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <Reveal direction="right" className="relative lg:col-span-6">
            {/* Gold frame offset behind the photo */}
            <div
              className="absolute -bottom-4 -left-4 right-8 top-8 rounded-3xl border-2 border-primary-gold/60"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
              <Image
                src="/images/team-image.jpeg"
                alt="The ElitePro Infra team"
                fill
                sizes="(min-width: 992px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-2 -top-6 rounded-2xl bg-dark-black px-6 py-4 text-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] sm:-right-6">
              <p className="text-xs font-bold uppercase tracking-[3px] text-white/60">Since</p>
              <p className="font-serif text-4xl font-bold text-primary-gold">2012</p>
            </div>
          </Reveal>

          <Reveal direction="left" className="lg:col-span-6">
            <p className={eyebrowClass}>Our Story &amp; Journey</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-dark-black sm:text-4xl lg:text-[2.6rem]">
              Building Trust. <span className="text-primary-gold">Creating Value.</span> Shaping
              Legacies.
            </h2>
            <h3 className="mt-6 text-lg font-bold text-dark-black">
              Our Story: More Than Real Estate
            </h3>
            <p className="mt-3 text-muted">
              At <strong className="text-dark-black">ElitePro Infra</strong>, we believe real estate
              is more than buying, selling, or investing in property. It is about aspirations,
              opportunities, financial growth, and the legacies people build for generations to
              come.
            </p>
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 text-muted">
                {paragraph}
              </p>
            ))}
            <blockquote className="mt-6 border-l-4 border-primary-gold bg-primary-gold/[0.06] py-4 pl-5 pr-4 italic text-dark-black">
              For us, success is not measured by a sale alone. It is measured by the
              confidence our clients place in us, the decisions we help them make, and the
              long-term relationships we build along the way.
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Journey chapters */}
      <section className="relative overflow-hidden bg-dark-gradient py-20 text-white lg:py-28">
        <div className="container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className={eyebrowClass}>Our Journey</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              From a Vision to a Growing Real Estate Advisory Brand
            </h2>
            <p className="mt-4 text-white/60">
              Every milestone in our journey reflects our commitment to progress, professionalism,
              and the trust of our clients.
            </p>
          </div>

          <div className="relative space-y-16 lg:space-y-24">
            {/* Centre spine on desktop */}
            <div
              className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-primary-gold/50 to-transparent lg:block"
              aria-hidden="true"
            />
            {chapters.map((chapter, index) => {
              const flip = index % 2 === 1;
              return (
                <div
                  key={chapter.title}
                  className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-24"
                >
                  <span
                    className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#111] bg-primary-gold shadow-[0_0_0_4px_rgba(212,175,55,0.25)] lg:block"
                    aria-hidden="true"
                  />
                  <Reveal direction={flip ? "left" : "right"} className={flip ? "lg:order-2" : ""}>
                    <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={chapter.image}
                        alt=""
                        fill
                        sizes="(min-width: 992px) 45vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute bottom-3 left-5 text-7xl sm:text-8xl ${outlineNumberClass}`}
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </Reveal>
                  <Reveal direction={flip ? "right" : "left"} className={flip ? "lg:order-1 lg:text-right" : ""}>
                    <p className={eyebrowClass}>{chapter.stage}</p>
                    <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                      {chapter.title}
                    </h3>
                    <div
                      className={`mt-4 h-[3px] w-16 bg-primary-gold ${flip ? "lg:ml-auto" : ""}`}
                      aria-hidden="true"
                    />
                    <p className="mt-5 leading-relaxed text-white/70">{chapter.text}</p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What sets us apart */}
      <section className="bg-bs-light py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className={eyebrowClass}>Why Choose Us</p>
            <h2 className="mt-3 text-3xl font-bold text-dark-black sm:text-4xl">
              What Sets <span className="text-primary-gold">ElitePro Infra</span> Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={((index % 3) * 100) as 0 | 100 | 200}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-black/5 bg-white p-8 shadow-bs-sm transition-all duration-500 hover:-translate-y-2 hover:bg-dark-black hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)]">
                  <span
                    className="absolute left-0 top-0 h-1 w-0 bg-primary-gold transition-all duration-500 group-hover:w-full"
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute right-6 top-5 text-6xl opacity-60 ${outlineNumberClass}`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-gold/10 text-xl text-primary-gold transition-colors duration-500 group-hover:bg-primary-gold group-hover:text-dark-black">
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-dark-black transition-colors duration-500 group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/70">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, vision and core values */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
            <Reveal direction="right" className="relative min-h-[320px] overflow-hidden rounded-3xl lg:col-span-5">
              <Image
                src="/images/heroes/about.webp"
                alt=""
                fill
                sizes="(min-width: 992px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
                aria-hidden="true"
              />
              <p className="absolute bottom-8 left-8 right-8 text-2xl font-bold leading-snug text-white">
                Purpose that guides <span className="text-primary-gold">every decision</span> we
                help you make.
              </p>
            </Reveal>
            <div className="grid gap-6 lg:col-span-7">
              {purpose.map((item, index) => (
                <Reveal key={item.title} direction="left" delay={index === 0 ? 0 : 100}>
                  <div className="flex h-full gap-5 rounded-3xl border border-primary-gold/25 bg-linear-to-br from-primary-gold/[0.08] to-transparent p-8">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-gold text-xl text-white shadow-[0_10px_25px_rgba(212,175,55,0.4)]">
                      <i className={item.icon} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-dark-black">{item.title}</h3>
                      <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <p className={eyebrowClass}>What We Stand For</p>
            <h2 className="mt-3 text-3xl font-bold text-dark-black sm:text-4xl">Our Core Values</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((item, index) => (
              <Reveal key={item.title} delay={(index * 100) as 0 | 100 | 200 | 300 | 400}>
                <div className="group h-full rounded-2xl border border-bs-border bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-gold hover:shadow-[0_20px_40px_rgba(212,175,55,0.18)]">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-primary-gold/50 text-2xl text-primary-gold transition-transform duration-500 group-hover:rotate-[360deg]">
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-bold text-dark-black">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our promise + CTA */}
      <section className="relative overflow-hidden py-24 text-white lg:py-32">
        <Image
          src="/images/global-india.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/80" aria-hidden="true" />
        <div className="container relative z-[1]">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className={eyebrowClass}>Our Promise</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Your Goals. Our Guidance.{" "}
              <span className="text-primary-gold">A Shared Future.</span>
            </h2>
            <p className="mt-6 leading-relaxed text-white/75">
              At ElitePro Infra, we understand that every property decision carries significance.
              Whether you are searching for your dream home, exploring a commercial investment,
              expanding your property portfolio, or considering opportunities in India from
              overseas, our team is committed to guiding you with care, clarity, and professional
              expertise.
            </p>
            <p className="mt-4 leading-relaxed text-white/75">
              We are proud of the journey behind us and excited about the possibilities ahead. As
              we continue to grow, our purpose remains unchanged: to connect people with the right
              opportunities and build relationships that stand the test of time.
            </p>
            <p className="mt-10 font-serif text-xl italic text-primary-gold sm:text-2xl">
              ElitePro Infra — Beyond Property. Building Trust. Creating Legacies.
            </p>

            <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-primary-gold/40 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
              <h3 className="text-2xl font-bold">Begin Your Real Estate Journey with Us</h3>
              <p className="mt-3 text-white/70">
                Let us help you explore the right opportunities for your next chapter.
              </p>
              <p className="mt-3 text-white/70">
                <strong className="text-white">Connect with ElitePro Infra today</strong> to
                discover curated properties, personalized advisory, and real estate solutions
                aligned with your goals.
              </p>
              <Button href="/contact" iconRight="fas fa-arrow-right" className="mt-8">
                Connect With Us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
