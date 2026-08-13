import IconBadge from "@/components/ui/IconBadge";
import type { IconTextItem } from "@/lib/types";

export default function EssenceCard({ icon, title, description }: IconTextItem) {
  return (
    <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold/30 hover:shadow-[0_15px_35px_rgba(212,175,55,0.12)]">
      <IconBadge icon={icon} variant="muted" className="mb-4" />
      <h3 className="font-bold text-dark-black">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
  );
}
