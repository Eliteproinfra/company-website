"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { InsightHubCategory } from "@/lib/data/insightsHub";

export default function InsightsHubTabs({ categories }: { categories: InsightHubCategory[] }) {
  const [active, setActive] = useState(categories[0].key);
  const current = categories.find((category) => category.key === active) ?? categories[0];
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const track = trackRefs.current[active];
    if (!track) return;
    track.scrollTo({ left: 0 });

    const interval = setInterval(() => {
      const card = track.firstElementChild as HTMLElement | null;
      const step = (card?.offsetWidth ?? 280) + 24;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;

      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setActive(category.key)}
            className={clsx(
              "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
              active === category.key
                ? "border-primary-gold bg-primary-gold text-white"
                : "border-border-pill bg-transparent text-pill-text"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
      {/* All three panels stay mounted — only the active one is displayed — so the
          full set of articles ships in the HTML like the reference site's tabs. */}
      <div className="relative">
        {categories.map((category) => (
          <div
            key={category.key}
            ref={(node) => {
              trackRefs.current[category.key] = node;
            }}
            className={clsx(
              "no-scrollbar snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2",
              category.key === active ? "flex" : "hidden"
            )}
            role="group"
            aria-label={`${category.label} insights`}
          >
            {category.items.map((item) => (
              <div
                key={item.href}
                className="group w-[85%] shrink-0 snap-start overflow-hidden rounded-md border border-black/[0.175] bg-white shadow-bs-sm sm:w-[46%] lg:w-[23.5%]"
              >
                <div className="relative h-[200px] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-black/[0.175] p-5">
                  <p className="font-bold text-bs-dark">{item.title}</p>
                  <p className="mt-2 text-[13px] text-bs-muted">{item.excerpt}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-bs-link underline transition-colors hover:text-bs-link-hover"
                  >
                    Read more <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href={current.hubHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary-gold"
        >
          {current.hubLabel} <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
