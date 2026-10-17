"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import AwardLightbox from "@/components/awards/AwardLightbox";
import type { Award } from "@/lib/types";

const MAX_TILT = 10; // degrees

// Tilts the card toward the cursor; skipped for touch and reduced-motion users.
function tiltTowardCursor(event: React.PointerEvent<HTMLButtonElement>) {
  if (event.pointerType !== "mouse") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  card.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
  card.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
  card.style.transform = `perspective(800px) rotateX(${-y * MAX_TILT * 2}deg) rotateY(${x * MAX_TILT * 2}deg) scale(1.04)`;
}

function resetTilt(event: React.PointerEvent<HTMLButtonElement>) {
  event.currentTarget.style.transform = "";
}

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
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-5"
        role="group"
        aria-label="Awards and recognitions"
      >
        {awards.map(({ image, caption }, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            onPointerMove={tiltTowardCursor}
            onPointerLeave={resetTilt}
            aria-label={
              caption
                ? `View “${caption}” enlarged`
                : `View award ${index + 1} of ${awards.length} enlarged`
            }
            className="flex aspect-square w-[50%] shrink-0 cursor-zoom-in snap-start items-center justify-center group relative overflow-hidden rounded-lg bg-white p-1 shadow-bs-sm transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:shadow-[0_18px_35px_rgba(0,0,0,0.18),0_0_0_2px_var(--color-primary-gold),0_0_24px_rgba(212,175,55,0.45)] sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]"
          >
            <Image
              src={image}
              alt={caption || "Elite Pro Infraventure award recognition"}
              width={400}
              height={400}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
            {/* Gold glare that follows the cursor (position set by tiltTowardCursor). */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,50%),rgba(212,175,55,0.55),rgba(255,255,255,0.15)_25%,transparent_55%)]"
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
