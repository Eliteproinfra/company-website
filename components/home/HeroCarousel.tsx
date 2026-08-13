"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { HeroSlide } from "@/lib/types";

type HeroCarouselProps = {
  slides: HeroSlide[];
  /** Separate slide set for small screens, mirroring the live site's second carousel. */
  mobileSlides?: HeroSlide[];
  intervalMs?: number;
};

function Carousel({
  slides,
  intervalMs,
  className,
  priority,
}: {
  slides: HeroSlide[];
  intervalMs: number;
  className?: string;
  priority: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const goTo = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((current) => (current + 1) % total), intervalMs);
    return () => clearInterval(id);
  }, [paused, total, intervalMs]);

  return (
    <div
      className={clsx("relative h-[90vh] w-full overflow-hidden bg-dark-black", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured properties"
    >
      {/* Every slide stays in the DOM and only the active one is shown, matching
          the reference site's carousel (and keeping the copy crawlable). */}
      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === index;
        return (
          <div
            key={slide.image}
            aria-hidden={!isActive}
            className={clsx("absolute inset-0", !isActive && "hidden")}
          >
            <Image
              src={slide.image}
              alt={slide.heading ?? "Elite Pro Infraventure"}
              fill
              preload={priority && slideIndex === 0}
              sizes="100vw"
              style={{ objectPosition: slide.imagePosition ?? "center" }}
              className={clsx(
                "object-cover",
                isActive && "animate-kenburns",
                slide.heading && "opacity-70"
              )}
            />
            {slide.heading ? (
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
            ) : null}

            {slide.heading ? (
              <div
                className={clsx(
                  "relative z-10 flex h-full items-center px-6 text-white",
                  slide.align === "left" ? "justify-start text-left" : "justify-center text-center"
                )}
              >
                <div className={clsx("container", isActive && "animate-fade-in-up")}>
                  {slide.eyebrow ? (
                    <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-primary-gold">
                      {slide.eyebrow}
                    </p>
                  ) : null}
                  <p className="text-3xl font-bold [text-shadow:2px_2px_10px_rgba(0,0,0,0.5)] sm:text-4xl lg:text-5xl">
                    {slide.heading}
                  </p>
                  <p className="mt-5 max-w-3xl text-lg font-light text-white/70 sm:text-xl">
                    {slide.subheading}
                  </p>
                  {slide.showCta ? (
                    <div
                      className={clsx(
                        "mt-8 flex flex-wrap items-center gap-4",
                        slide.align === "left" ? "justify-start" : "justify-center"
                      )}
                    >
                      <Button href="/properties">Explore Properties</Button>
                      <Button href="/contact" variant="outline">
                        Get in Touch
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:left-6"
      >
        <i className="fas fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:right-6"
      >
        <i className="fas fa-chevron-right" aria-hidden="true" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={clsx(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-primary-gold" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroCarousel({
  slides,
  mobileSlides,
  intervalMs = 6000,
}: HeroCarouselProps) {
  // Both carousels render so the breakpoint swap is pure CSS (no hydration flash);
  // the single page <h1> lives here rather than inside either copy.
  const headline = slides.find((slide) => slide.heading)?.heading;

  return (
    <section>
      <h1 className="sr-only">
        {headline ?? "Elite Pro Infraventure | Premium Real Estate in Gurgaon & NCR"}
      </h1>
      <Carousel
        slides={slides}
        intervalMs={intervalMs}
        priority
        className={mobileSlides ? "hidden md:block" : undefined}
      />
      {mobileSlides ? (
        <Carousel
          slides={mobileSlides}
          intervalMs={intervalMs}
          priority={false}
          className="md:hidden"
        />
      ) : null}
    </section>
  );
}
