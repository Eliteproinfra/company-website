import type { Stat } from "@/lib/types";

/**
 * Live `.metric-card`: #fff, 1px #d1d1d1, 14px radius, 0 5px 20px rgba(0,0,0,.04); hover lifts
 * 5px with 0 15px 35px rgba(212,175,55,.12) and a rgba(212,175,55,.25) border. `.metric-icon`
 * is a white->#f8f9fa gradient tile with a rgba(212,175,55,.15) border and gold glyph that
 * flips to the gold gradient with a white glyph (rotate -5deg, scale 1.1) on hover. The value
 * is a #2c3e50->#000 text gradient; the label is #666. Live has no highlighted variant.
 */
export default function StatIconCard({ icon, value, label }: Stat) {
  return (
    <div className="group flex h-full items-center gap-[18px] rounded-[14px] border border-border-card-strong bg-white px-5 py-[25px] shadow-card-4 transition-all duration-300 hover:-translate-y-[5px] hover:border-primary-gold/25 hover:shadow-card-gold-12">
      <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border border-primary-gold/15 bg-linear-to-br from-white to-bs-light text-[1.4rem] text-primary-gold shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-all duration-300 group-hover:border-transparent group-hover:bg-gold-gradient group-hover:text-white group-hover:shadow-metric-icon group-hover:[transform:rotate(-5deg)_scale(1.1)]">
        <i className={icon} aria-hidden="true" />
      </div>
      <div>
        <p className="text-gradient-slate text-2xl font-extrabold">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
