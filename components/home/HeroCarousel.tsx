"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { HeroSlide } from "@/lib/types";

type HeroCarouselProps = {
  slides: HeroSlide[];
  intervalMs?: number;
};

export default function HeroCarousel({ slides, intervalMs = 6000 }: HeroCarouselProps) {
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

  const slide = slides[index];

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-dark-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured properties"
    >
      <div key={index} className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.heading ?? "Elite Pro Infraventure"}
          fill
          preload={index === 0}
          sizes="100vw"
          style={{ objectPosition: slide.imagePosition ?? "center" }}
          className={clsx(
            "animate-kenburns object-cover",
            slide.mobileImage && "hidden sm:block",
            slide.heading && "opacity-70"
          )}
        />
        {slide.mobileImage ? (
          <Image
            src={slide.mobileImage}
            alt={slide.heading ?? "Elite Pro Infraventure"}
            fill
            preload={index === 0}
            sizes="100vw"
            style={{ objectPosition: slide.imagePosition ?? "center" }}
            className={clsx("animate-kenburns object-cover sm:hidden", slide.heading && "opacity-70")}
          />
        ) : null}
        {slide.heading ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        ) : null}
      </div>

      {slide.heading ? (
        <div
          className={clsx(
            "relative z-10 flex h-full items-center px-6 text-white",
            slide.align === "left" ? "justify-start text-left" : "justify-center text-center"
          )}
        >
          <div
            className={clsx(
              "animate-fade-in-up max-w-3xl",
              slide.align === "left" && "sm:pl-6 lg:max-w-xl lg:pl-12"
            )}
          >
            {slide.eyebrow ? (
              <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-primary-gold">
                {slide.eyebrow}
              </p>
            ) : null}
            <h1 className="text-4xl font-bold [text-shadow:2px_2px_10px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-6xl">
              {slide.heading}
            </h1>
            <p className="mt-5 text-lg font-light sm:text-xl">{slide.subheading}</p>
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
      ) : (
        // This slide carries no visible heading (matches the reference site), but every
        // page still needs exactly one <h1> present from first paint for a11y/SEO.
        <h1 className="sr-only">Elite Pro Infraventure | Premium Real Estate in Gurgaon &amp; NCR</h1>
      )}

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
    </section>
  );
}
