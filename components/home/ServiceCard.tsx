import clsx from "clsx";
import Button from "@/components/ui/Button";
import IconBadge from "@/components/ui/IconBadge";
import type { IconTextItem } from "@/lib/types";

type ServiceCardProps = IconTextItem & {
  /**
   * `light` (default) = live `.service-card`: #fff, 1px #eee, 16px radius, 0 5px 20px
   *   rgba(0,0,0,.05); hover lifts 5px with 0 15px 35px rgba(212,175,55,.15) and a
   *   rgba(212,175,55,.3) border. h4 #2c3e50, p #666.
   * `dark` = live `.service-card-modern` (investment #services on `.section-dark-modern`):
   *   #1a1a1a, 1px #333, square corners; gold 2.5rem icon; h3 white -> gold on hover;
   *   p #b0b0b0; white link -> gold; hover lifts 10px and shows a 5% gold gradient wash.
   */
  variant?: "light" | "dark";
};

export default function ServiceCard({
  icon,
  title,
  description,
  href = "/contact",
  variant = "light",
}: ServiceCardProps) {
  if (variant === "dark") {
    return (
      <div className="group relative z-[1] flex h-full flex-col overflow-hidden border border-[#333] bg-light-black px-[30px] py-10 transition-all duration-[400ms] before:absolute before:inset-0 before:-z-[1] before:bg-linear-45 before:from-primary-gold before:to-secondary-gold before:opacity-0 before:transition-opacity before:duration-[400ms] before:content-[''] hover:-translate-y-2.5 hover:border-transparent hover:before:opacity-5">
        <i className={clsx(icon, "mb-6 text-[2.5rem] text-primary-gold")} aria-hidden="true" />
        <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-primary-gold">
          {title}
        </h3>
        <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-text-gray">{description}</p>
        <a
          href={href}
          className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-primary-gold"
        >
          Learn More
          <i
            className="fas fa-arrow-right transition-transform duration-300 group-hover:translate-x-[5px]"
            aria-hidden="true"
          />
        </a>
      </div>
    );
  }

  return (
    <div className="group flex h-full min-h-[280px] flex-col rounded-2xl border border-border-card bg-white px-5 py-[25px] shadow-card transition-all duration-300 hover:-translate-y-[5px] hover:border-primary-gold/30 hover:shadow-card-gold">
      <IconBadge icon={icon} variant="muted" className="mb-4" />
      <h3 className="text-lg font-bold text-slate-heading">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      <Button href={href} variant="outline" size="sm" className="mt-5 w-fit">
        Learn More
      </Button>
    </div>
  );
}
