"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export type SectionLink = { id: string; label: string };

/**
 * Sticky tab strip under the property header. Each tab jumps to its section,
 * and the tab for whichever section is currently in view is highlighted, so
 * the visitor always knows where they are in the page's sequence.
 */
export default function PropertySectionNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A section counts as current once its top passes just under the
      // navbar + this strip, and until it scrolls out of the top half.
      { rootMargin: "-140px 0px -55% 0px" },
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  // Keep the highlighted tab visible on narrow screens, where the strip scrolls.
  useEffect(() => {
    const tab = stripRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Property sections"
      className="sticky top-[60px] z-30 -mx-4 mb-6 border-y border-black/[0.06] bg-white/95 px-4 backdrop-blur lg:top-[66px] lg:mx-0 lg:rounded-2xl lg:border lg:px-2 lg:shadow-[0_10px_30px_rgba(0,0,0,0.05)] xl:top-[70px]"
    >
      <div ref={stripRef} className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            data-id={section.id}
            className={clsx(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active === section.id
                ? "bg-dark-black text-white"
                : "text-muted hover:bg-neutral-100 hover:text-dark-black",
            )}
          >
            <span
              className={clsx(
                "text-[0.7rem] font-bold",
                active === section.id ? "text-primary-gold" : "text-muted-4",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
