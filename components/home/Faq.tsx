"use client";

import clsx from "clsx";
import { useState } from "react";
import type { FaqItem } from "@/lib/data/faq";

type Variant = "premium" | "guideline";

/**
 * `dark` = the live home/awards `#faq` accordion (`.accordion-flush`, items `bg-transparent
 * border-bottom border-secondary`): white question that turns gold when open, white chevron
 * that turns gold, answer `.text-white-50`.
 * Light `premium` = live `.accordion-premium`: white 10px-radius button with 0 5px 15px
 * rgba(0,0,0,.05) and #0a0a0a text; open -> #0a0a0a background with gold text; body #f9f9f9
 * with #555 text.
 * Light `guideline` = live nri-corner `.guideline-accordion`: 8px-radius white items with
 * 0 5px 15px rgba(0,0,0,.03), #333 question; open -> rgba(212,175,55,.05) fill with gold text,
 * Bootstrap `.text-muted` body inside the same card.
 */
export default function Faq({
  items,
  dark = false,
  variant = "premium",
  className = "mx-auto max-w-3xl",
}: {
  items: FaqItem[];
  dark?: boolean;
  variant?: Variant;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const guideline = !dark && variant === "guideline";

  return (
    <div className={clsx(dark ? "divide-y divide-bs-secondary" : "space-y-[15px]", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={clsx(guideline && "overflow-hidden rounded-lg bg-white shadow-[0_5px_15px_rgba(0,0,0,0.03)]")}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className={clsx(
                "flex w-full items-center justify-between gap-4 text-left transition-colors duration-200",
                dark
                  ? clsx("px-5 py-4 text-white", isOpen && "text-primary-gold")
                  : guideline
                    ? clsx("p-5", isOpen ? "bg-primary-gold/5 text-primary-gold" : "bg-white text-muted-5")
                    : clsx(
                        "rounded-[10px] px-[25px] py-5 shadow-[0_5px_15px_rgba(0,0,0,0.05)]",
                        isOpen
                          ? "bg-dark-black text-primary-gold shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                          : "bg-white text-dark-black"
                      )
              )}
            >
              <span className="font-semibold">{item.question}</span>
              <i
                className={clsx(
                  "fas fa-chevron-down shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180 text-primary-gold",
                  !isOpen && (dark ? "text-white" : "text-bs-dark")
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
                <p
                  className={clsx(
                    dark
                      ? "px-5 pb-4 text-white/50"
                      : guideline
                        ? "px-5 pb-5 text-bs-muted"
                        : "mt-2.5 rounded-[10px] bg-leader-profile p-[25px] leading-relaxed text-muted-2"
                  )}
                >
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
