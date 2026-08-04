import Button from "@/components/ui/Button";
import IconBadge from "@/components/ui/IconBadge";
import type { IconTextItem } from "@/lib/types";

export default function ServiceCard({ icon, title, description, href = "/contact" }: IconTextItem) {
  return (
    <div className="group flex h-full min-h-[280px] flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold/30 hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)]">
      <IconBadge icon={icon} variant="muted" className="mb-4" />
      <h3 className="text-lg font-bold text-dark-black">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{description}</p>
      <Button href={href} variant="outline" size="sm" className="mt-5 w-fit">
        Learn More
      </Button>
    </div>
  );
}
