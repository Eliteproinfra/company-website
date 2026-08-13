"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import ReviewCard from "@/components/home/ReviewCard";
import type { Review } from "@/lib/data/reviews";

const PER_SLIDE = 3;

export default function ReviewsCarousel({
  reviews,
  intervalMs = 6000,
}: {
  reviews: Review[];
  intervalMs?: number;
}) {
  const slides = useMemo(() => {
    const grouped: Review[][] = [];
    for (let i = 0; i < reviews.length; i += PER_SLIDE) {
      grouped.push(reviews.slice(i, i + PER_SLIDE));
    }
    return grouped;
  }, [reviews]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  useEffect(() => {
    if (paused || total < 2) return;
    const id = setInterval(() => setIndex((current) => (current + 1) % total), intervalMs);
    return () => clearInterval(id);
  }, [paused, total, intervalMs]);

  if (!total) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Google reviews"
    >
      {/* Every slide stays mounted so all reviews are present in the HTML, the
          way the reference site's carousel items are. */}
      {slides.map((slide, slideIndex) => (
        <div
          key={slideIndex}
          aria-hidden={slideIndex !== index}
          className={clsx(
            "grid grid-cols-1 gap-6 md:grid-cols-3",
            slideIndex !== index && "hidden"
          )}
        >
          {slide.map((review) => (
            <ReviewCard key={review.name + review.quote.slice(0, 24)} {...review} />
          ))}
        </div>
      ))}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setIndex((current) => (current - 1 + total) % total)}
          aria-label="Previous reviews"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-dark-black transition-colors hover:border-primary-gold hover:text-primary-gold"
        >
          <i className="fas fa-chevron-left text-sm" aria-hidden="true" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to review slide ${i + 1}`}
              aria-current={i === index}
              className={clsx(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-primary-gold" : "w-2 bg-neutral-300 hover:bg-neutral-400"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIndex((current) => (current + 1) % total)}
          aria-label="Next reviews"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-dark-black transition-colors hover:border-primary-gold hover:text-primary-gold"
        >
          <i className="fas fa-chevron-right text-sm" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
