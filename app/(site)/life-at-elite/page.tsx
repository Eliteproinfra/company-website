import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import MomentsGallery from "@/components/careers/MomentsGallery";
import { cultureItems, momentsGallery, csrInitiatives, joinBenefits } from "@/lib/data/lifeAtElite";

export const metadata: Metadata = {
  title: "Life at Elite Pro Infra",
  description: "Where Passion Meets Purpose — culture, celebrations, and community at Elite Pro Infraventure.",
};

const delaySequence = [0, 100, 200, 300] as const;

/*
 * life-at-elite.php uses its own palette (--elite-gold #bfa881, --elite-black #121212):
 * .life-hero (.5 -> .7, fixed, fades to white; title + gold uppercase subtitle, no breadcrumb),
 * .culture-section white with .culture-card (#eee border, fills #bfa881 on hover),
 * .events-section #f9f9f9 two-column .moments-grid, .csr-section #121212 with a frosted
 * gold-bordered box + photo, .perks-section office photo under rgba(255,255,255,.95).
 */
export default function LifeAtElitePage() {
  return (
    <>
      <section className="relative flex h-[70vh] items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.7)),url('/images/bg/life-culture.jpg')] bg-cover bg-fixed bg-center text-center text-white">
        <div className="absolute inset-x-0 bottom-0 h-[100px] bg-linear-to-t from-white to-transparent" aria-hidden="true" />
        <div className="container">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-[4rem]">Life at Elite Pro Infra</h1>
          <p className="mt-5 text-lg font-light uppercase tracking-[3px] text-leader-gold sm:text-2xl">
            Where Passion Meets Purpose
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-[100px]">
        <div className="container">
          <div className="mb-12 text-center">
            <h6 className="text-sm uppercase tracking-[2px] text-bs-muted">Our Culture</h6>
            <h2 className="mt-2 text-3xl font-bold text-dark-black sm:text-4xl lg:text-[3rem]">
              More Than Just A Workplace
            </h2>
            <div className="mx-auto mt-3 h-[3px] w-[60px] bg-leader-gold" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {cultureItems.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="group relative z-[1] h-full overflow-hidden border border-border-card bg-white p-10 transition-all duration-[400ms] before:absolute before:inset-y-0 before:left-0 before:-z-[1] before:w-0 before:bg-leader-gold before:transition-[width] before:duration-[400ms] before:content-[''] hover:before:w-full">
                  <i
                    className={`${item.icon} mb-5 block text-[3rem] text-leader-gold transition-colors duration-[400ms] group-hover:text-white`}
                    aria-hidden="true"
                  />
                  <h3 className="mb-3 text-2xl font-bold text-dark-black transition-colors duration-[400ms] group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="text-bs-muted transition-colors duration-[400ms] group-hover:text-white">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-leader-profile py-20 lg:py-[100px]">
        <div className="mx-auto w-full px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-dark-black sm:text-4xl lg:text-[3rem]">Moments of Joy</h2>
            <p className="mt-3 text-lg text-bs-muted">Capturing the spirit of togetherness at Elite Pro Infra</p>
          </div>
          <MomentsGallery items={momentsGallery} />
        </div>
      </section>

      <section className="bg-land-dark py-[120px] text-white">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="lg:order-2">
              <div className="border-l-[5px] border-leader-gold bg-white/5 p-[50px] backdrop-blur-[10px]">
                <h6 className="mb-2 text-sm uppercase tracking-[2px] text-primary-gold">Social Responsibility</h6>
                <h2 className="mb-6 text-3xl font-normal text-white sm:text-4xl lg:text-[3rem]">Giving Back to Society</h2>
                <p className="mb-6 text-white/50">
                  At Elite Pro Infra, success is not just measured by numbers, but by the impact we
                  create. We are deeply committed to uplifting the communities around us. From
                  supporting education for underprivileged children to environmental sustainability
                  drives, we believe in building a better future for everyone.
                </p>
                <ul className="space-y-3 text-white/50">
                  {csrInitiatives.map((item) => (
                    <li key={item}>
                      <i className="fas fa-check-circle mr-2 text-primary-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href="/social-commitment" variant="outline-light" className="mt-6 rounded-none px-6 py-2">
                  Read Our Stories
                </Button>
              </div>
            </div>
            <div className="lg:order-1">
              {/* Live `.csr-img-wrapper img`: box-shadow -20px 20px 0 #bfa881 */}
              <Image
                src="/images/bg/csr-hands.jpg"
                alt="Elite Pro Infra community initiative"
                width={1200}
                height={800}
                className="h-auto w-full shadow-[-20px_20px_0_#bfa881]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-perks-section py-20 lg:py-[100px]">
        <div className="absolute inset-0 bg-white/95" aria-hidden="true" />
        <div className="container relative z-[1]">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-dark-black sm:text-4xl lg:text-[3rem]">Why Join Elite?</h2>
            <p className="mt-3 text-lg text-bs-muted">Perks that make work worthwhile</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {joinBenefits.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <div className="h-full p-[30px] text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-leader-gold text-[2rem] text-white shadow-[0_10px_20px_rgba(191,168,129,0.4)]">
                    <i className={item.icon} aria-hidden="true" />
                  </div>
                  <h4 className="text-xl font-bold text-dark-black">{item.title}</h4>
                  <p className="mt-2 text-sm text-bs-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
