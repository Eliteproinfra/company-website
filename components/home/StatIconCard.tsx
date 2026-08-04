import type { Stat } from "@/lib/types";

export default function StatIconCard({ icon, value, label }: Stat) {
  return (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold/30">
      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-primary-gold/10 text-xl text-primary-gold">
        <i className={icon} aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold text-dark-black">{value}</p>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  );
}
