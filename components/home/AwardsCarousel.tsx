"use client";

import Image from "next/image";
import { useRef } from "react";

export default function AwardsCarousel({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 160) + 16;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        role="group"
        aria-label="Awards and recognitions"
      >
        {images.map((image) => (
          <div
            key={image}
            className="flex aspect-square w-[28%] shrink-0 snap-start items-center justify-center rounded-xl border border-neutral-100 bg-white p-3 sm:w-[22%] md:w-[17%] lg:w-[13.5%]"
          >
            <Image
              src={image}
              alt="Elite Pro Infraventure award recognition"
              width={140}
              height={140}
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll awards left"
        className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-3 text-dark-black shadow-md transition-colors hover:border-primary-gold hover:text-primary-gold sm:flex"
      >
        <i className="fas fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll awards right"
        className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-3 text-dark-black shadow-md transition-colors hover:border-primary-gold hover:text-primary-gold sm:flex"
      >
        <i className="fas fa-chevron-right" aria-hidden="true" />
      </button>
    </div>
  );
}
