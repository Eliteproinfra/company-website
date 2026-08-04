"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { InsightHubCategory } from "@/lib/data/insightsHub";

export default function InsightsHubTabs({ categories }: { categories: InsightHubCategory[] }) {
  const [active, setActive] = useState(categories[0].key);
  const current = categories.find((category) => category.key === active) ?? categories[0];

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
                ? "border-primary-gold bg-primary-gold text-dark-black"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-primary-gold/50 hover:text-dark-black"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {current.items.map((item) => (
          <div
            key={item.title}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_5px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]"
          >
            <div className="relative h-[200px] w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="font-semibold text-dark-black">{item.title}</p>
            </div>
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
