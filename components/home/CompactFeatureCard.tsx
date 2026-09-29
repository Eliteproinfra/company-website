import clsx from "clsx";
import type { IconTextItem } from "@/lib/types";

type CompactFeatureCardProps = IconTextItem & {
  /**
   * `service` (default) = live `.service-box-premium` (home "Our Expertise"):
   *   #fff, 1px #d1d1d1, 14px radius, 0 5px 15px rgba(0,0,0,.03); white->#f8f9fa icon tile with
   *   rgba(212,175,55,.15) border and gold glyph; h5 #2c3e50, p #666. Hover: lift 5px,
   *   0 15px 30px rgba(212,175,55,.12), border rgba(212,175,55,.25), h5 gold, icon gold
   *   gradient + white glyph, scale 1.1.
   * `nri` = live home `.nri-card.card.border-0.shadow-sm.rounded-4`: #fff, no border, Bootstrap
   *   shadow-sm, 1rem radius; `.icon-box-premium` gold/10 circle with gold glyph; h5 #212529,
   *   p Bootstrap text-muted. Hover: lift 10px, 0 10px 30px rgba(0,0,0,.1), a 4px gold bar
   *   scales in on the left, icon turns solid gold with a white glyph.
   */
  variant?: "service" | "nri";
};

export default function CompactFeatureCard({
  icon,
  title,
  description,
  variant = "service",
}: CompactFeatureCardProps) {
  const nri = variant === "nri";

  return (
    <div
      className={clsx(
        "group relative flex h-full items-start gap-[18px] overflow-hidden bg-white transition-all duration-300",
        nri
          ? "rounded-2xl p-6 shadow-bs-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:origin-top before:scale-y-0 before:bg-primary-gold before:transition-transform before:duration-[400ms] before:content-[''] hover:-translate-y-2.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:before:scale-y-100"
          : "rounded-[14px] border border-border-card-strong px-5 py-[25px] shadow-service-box hover:-translate-y-[5px] hover:border-primary-gold/25 hover:shadow-service-box-hover"
      )}
    >
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center text-primary-gold transition-all duration-300",
          nri
            ? "h-[60px] w-[60px] rounded-full bg-primary-gold/10 text-2xl group-hover:bg-primary-gold group-hover:text-white"
            : "h-[52px] w-[52px] rounded-xl border border-primary-gold/15 bg-linear-to-br from-white to-bs-light text-[1.3rem] shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:scale-110 group-hover:border-transparent group-hover:bg-gold-gradient group-hover:text-white"
        )}
      >
        <i className={icon} aria-hidden="true" />
      </div>
      <div>
        <h3
          className={clsx(
            "font-bold transition-colors duration-300",
            nri ? "text-bs-dark" : "text-slate-heading group-hover:text-primary-gold"
          )}
        >
          {title}
        </h3>
        <p className={clsx("mt-1.5 text-sm leading-relaxed", nri ? "text-bs-muted" : "text-muted")}>
          {description}
        </p>
      </div>
    </div>
  );
}
