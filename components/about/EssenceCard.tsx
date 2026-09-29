import IconBadge from "@/components/ui/IconBadge";
import type { IconTextItem } from "@/lib/types";

export default function EssenceCard({ icon, title, description }: IconTextItem) {
  return (
    <div className="group h-full rounded-2xl border border-border-card bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-[5px] hover:border-primary-gold/30 hover:shadow-card-gold">
      <IconBadge icon={icon} variant="muted" className="mb-4" />
      <h3 className="font-bold text-slate-heading">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}
