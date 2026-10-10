import type { ReactNode } from "react";

type PresenceCardProps = {
  title: string;
  /** The claim in numbers, e.g. "24 cities · Gurgaon HQ". */
  meta: string;
  description: string;
  /** A PresenceMap. Passed in so the card stays a layout shell. */
  map: ReactNode;
};

/**
 * One half of the home page's footprint section: a titled card holding a map
 * and the copy for it.
 *
 * Deliberately not a hover-lift card like CompactFeatureCard: the pins inside
 * are the interactive part, and having the whole card shift under the cursor
 * while you are trying to read a pin label fights that.
 */
export default function PresenceCard({ title, meta, description, map }: PresenceCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-border-card-strong bg-white shadow-service-box">
      <header className="px-6 pt-6">
        <h3 className="text-lg font-bold text-slate-heading">{title}</h3>
        <p className="mt-0.5 text-xs font-bold uppercase tracking-[1px] text-primary-gold">
          {meta}
        </p>
      </header>

      {/* The night panel lives on the artwork's own box inside PresenceMap, not
          here: the land runs to the edge of the viewBox, so a panel any wider
          than the picture shows a hard rectangular seam where it stops. */}
      <div className="mx-6 mt-5">{map}</div>

      <p className="px-6 pb-6 pt-5 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}
