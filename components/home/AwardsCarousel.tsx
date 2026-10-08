"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import AwardLightbox from "@/components/awards/AwardLightbox";
import type { Award } from "@/lib/types";

export default function AwardsCarousel({ awards }: { awards: Award[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 240) + 20;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        role="group"
        aria-label="Awards and recognitions"
      >
        {awards.map(({ image, caption }, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={
              caption
                ? `View “${caption}” enlarged`
                : `View award ${index + 1} of ${awards.length} enlarged`
            }
            className="flex aspect-square w-[50%] shrink-0 cursor-zoom-in snap-start items-center justify-center rounded-lg bg-white p-1 shadow-bs-sm sm:w-[36%] md:w-[25%] lg:w-[18%]"
          >
            <Image
              src={image}
              alt={caption || "Elite Pro Infraventure award recognition"}
              width={260}
              height={260}
              sizes="(min-width: 1024px) 18vw, (min-width: 768px) 25vw, (min-width: 640px) 36vw, 50vw"
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll awards left"
        className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border-pill bg-white p-3 text-dark-black shadow-bs-sm transition-colors hover:border-primary-gold hover:text-primary-gold sm:flex"
      >
        <i className="fas fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll awards right"
        className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border-pill bg-white p-3 text-dark-black shadow-bs-sm transition-colors hover:border-primary-gold hover:text-primary-gold sm:flex"
      >
        <i className="fas fa-chevron-right" aria-hidden="true" />
      </button>

      <AwardLightbox
        images={awards.map((award) => award.image)}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </div>
  );
}
