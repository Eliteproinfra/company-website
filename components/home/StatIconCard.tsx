import type { Stat } from "@/lib/types";

/**
 * Dark glass stat tile for the home "Why Choose Elite Pro?" section. The icon sits in a
 * gold-tinted tile that fills with the gold gradient on hover while the card lifts and
 * its hairline border warms to gold.
 */
export default function StatIconCard({ icon, value, label }: Stat) {
  return (
    <div className="group flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold/40 hover:bg-white/[0.07] hover:shadow-[0_18px_40px_rgba(212,175,55,0.12)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-gold/30 bg-primary-gold/10 text-[1.2rem] text-primary-gold transition-all duration-300 group-hover:border-transparent group-hover:bg-gold-gradient group-hover:text-ink group-hover:[transform:rotate(-5deg)_scale(1.08)]">
        <i className={icon} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold leading-tight text-white">{value}</p>
        <p className="mt-0.5 text-sm text-white/60">{label}</p>
      </div>
    </div>
  );
}
