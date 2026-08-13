import clsx from "clsx";
import type { IconTextItem } from "@/lib/types";

export default function CompactFeatureCard({
  icon,
  title,
  description,
  highlight,
}: IconTextItem) {
  return (
    <div
      className={clsx(
        "flex h-full items-start gap-4 rounded-2xl border p-6 shadow-[0_5px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1",
        highlight
          ? "border-primary-gold bg-gradient-to-br from-primary-gold to-secondary-gold hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)]"
          : "border-neutral-200 bg-white hover:border-primary-gold/30 hover:shadow-[0_15px_35px_rgba(212,175,55,0.12)]"
      )}
    >
      <div
        className={clsx(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg",
          highlight ? "bg-white/25 text-white" : "bg-primary-gold/10 text-primary-gold"
        )}
      >
        <i className={icon} aria-hidden="true" />
      </div>
      <div>
        <h3 className={clsx("font-bold", highlight ? "text-white" : "text-dark-black")}>
          {title}
        </h3>
        <p
          className={clsx(
            "mt-1.5 text-sm leading-relaxed",
            highlight ? "text-white/85" : "text-neutral-500"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
