"use client";

import clsx from "clsx";
import { useState } from "react";
import type { FaqItem } from "@/lib/data/faq";

export default function Faq({
  items,
  dark = false,
  className = "mx-auto max-w-3xl",
}: {
  items: FaqItem[];
  dark?: boolean;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div
      className={clsx(
        "divide-y rounded-2xl border",
        dark
          ? "divide-white/15 border-white/15 bg-white/5 backdrop-blur-sm"
          : "divide-neutral-200 border-neutral-200 bg-white",
        className
      )}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className={clsx("font-semibold", dark ? "text-white" : "text-dark-black")}>
                {item.question}
              </span>
              <i
                className={clsx(
                  "fas fa-chevron-down shrink-0 text-primary-gold transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            <div
              className={clsx(
                "grid overflow-hidden transition-all duration-300",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="min-h-0">
                <p className={clsx("px-6 pb-5", dark ? "text-white/70" : "text-neutral-500")}>
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
