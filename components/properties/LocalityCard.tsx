import type { LocalityItem } from "@/lib/types";

export default function LocalityCard({ icon, name, area }: LocalityItem) {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-lg border-l-4 border-l-transparent bg-white p-5 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:translate-x-1 hover:border-l-primary-gold">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff8e1] text-primary-gold">
          <i className={icon} aria-hidden="true" />
        </div>
        <div>
          <h4 className="font-semibold text-dark-black">{name}</h4>
          <p className="text-sm text-neutral-500">{area}</p>
        </div>
      </div>
      <i className="fas fa-chevron-right text-sm text-neutral-400" aria-hidden="true" />
    </div>
  );
}
