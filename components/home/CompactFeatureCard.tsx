import type { IconTextItem } from "@/lib/types";

export default function CompactFeatureCard({ icon, title, description }: IconTextItem) {
  return (
    <div className="flex h-full items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold/30 hover:shadow-[0_15px_35px_rgba(212,175,55,0.12)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-gold/10 text-lg text-primary-gold">
        <i className={icon} aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-bold text-dark-black">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
