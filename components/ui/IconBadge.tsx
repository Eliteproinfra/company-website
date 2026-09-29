import clsx from "clsx";

type IconBadgeProps = {
  icon: string;
  variant?: "muted" | "tinted";
  flip?: boolean;
  size?: "md" | "lg";
  className?: string;
};

const sizeClasses: Record<NonNullable<IconBadgeProps["size"]>, string> = {
  md: "h-[60px] w-[60px] text-2xl",
  lg: "h-[70px] w-[70px] text-3xl",
};

const wrapperVariantClasses: Record<NonNullable<IconBadgeProps["variant"]>, string> = {
  // Live `.service-card .icon-wrapper`: #f8f9fa -> white with 0 5px 15px rgba(0,0,0,.1) on hover.
  muted: "bg-bs-light group-hover:bg-white group-hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)]",
  // Live `.icon-box-premium`: rgba(212,175,55,.1) -> solid gold on hover.
  tinted: "bg-primary-gold/10 group-hover:bg-primary-gold",
};

const iconVariantClasses: Record<NonNullable<IconBadgeProps["variant"]>, string> = {
  muted:
    "text-slate-heading transition-transform duration-300 group-hover:scale-110 group-hover:text-primary-gold",
  tinted: "text-primary-gold transition-colors duration-300 group-hover:text-white",
};

/**
 * `variant="muted"`: light-gray circle, slate icon that turns gold on hover (ServiceCard).
 * `variant="tinted"`: translucent-gold circle, gold icon that inverts to solid-gold+white on hover
 * (NRICard, VisionMissionCard, PMFeatureCard). `flip` adds a 180-degree rotation (PMFeatureCard only).
 * Requires an ancestor with the `group` class to drive the hover states.
 */
export default function IconBadge({
  icon,
  variant = "tinted",
  flip = false,
  size = "md",
  className,
}: IconBadgeProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full transition-all duration-300",
        sizeClasses[size],
        wrapperVariantClasses[variant],
        flip && "group-hover:[transform:rotateY(180deg)]",
        className
      )}
    >
      <i className={clsx(icon, iconVariantClasses[variant])} aria-hidden="true" />
    </div>
  );
}
