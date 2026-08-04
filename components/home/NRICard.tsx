import IconBadge from "@/components/ui/IconBadge";
import type { IconTextItem } from "@/lib/types";

export default function NRICard({ icon, title, description }: IconTextItem) {
  return (
    <div className="group h-full rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      <IconBadge icon={icon} variant="tinted" className="mb-4" />
      <h3 className="text-base font-bold text-dark-black">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500">{description}</p>
    </div>
  );
}
