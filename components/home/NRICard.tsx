import IconBadge from "@/components/ui/IconBadge";
import type { IconTextItem } from "@/lib/types";

/** Live `.nri-card` (NRI advisory page): #fff, 1px #eee, no radius; hover lifts 10px with
 *  0 20px 40px rgba(0,0,0,.1) and a 4px gold bar scaling in on the left. Title #0a0a0a, text #666. */
export default function NRICard({ icon, title, description }: IconTextItem) {
  return (
    <div className="group relative h-full overflow-hidden border border-border-card bg-white px-[30px] py-10 transition-all duration-[400ms] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:origin-top before:scale-y-0 before:bg-primary-gold before:transition-transform before:duration-[400ms] before:content-[''] hover:-translate-y-2.5 hover:shadow-card-hover hover:before:scale-y-100">
      <IconBadge icon={icon} variant="tinted" className="mb-4" />
      <h3 className="text-base font-bold text-dark-black">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
