import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Variants map 1:1 onto the live site's button classes (values copied from its
 * style.css / Bootstrap 5.3.2):
 * - `solid`         -> `.btn-gold`
 * - `outline`       -> `.btn-outline-gold`
 * - `outline-light` -> Bootstrap `.btn-outline-light`
 * - `dark`          -> `.btn-outline-dark`
 * - `bs-dark`       -> Bootstrap `.btn-dark`
 * - `light`         -> Bootstrap `.btn-light.text-gold`
 * - `details`       -> `.property-details .btn`
 * - `apply`         -> `.apply-btn` (careers job cards)
 */
type Variant = "solid" | "outline" | "outline-light" | "dark" | "bs-dark" | "light" | "details" | "apply";
type Size = "md" | "sm" | "xs";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  iconLeft?: string;
  iconRight?: string;
  className?: string;
};

type ButtonProps = CommonProps & {
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl uppercase transition-all duration-200 focus-visible:outline-none focus-visible:shadow-btn-focus";

const sizeClasses: Record<Size, string> = {
  md: "px-[22px] py-3 text-sm",
  sm: "px-4 py-2 text-xs",
  xs: "px-[15px] py-1.5 text-xs",
};

const variantClasses: Record<Variant, string> = {
  solid:
    "border border-black/[0.08] bg-gold-gradient font-bold tracking-[0.8px] text-ink shadow-btn-gold hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-btn-gold-hover",
  outline:
    "border-2 border-primary-gold/85 bg-primary-gold/10 font-bold tracking-[0.8px] text-primary-gold hover:-translate-y-0.5 hover:border-black/[0.08] hover:bg-gold-gradient hover:text-ink hover:shadow-btn-outline-hover",
  // Renders on live as a white-filled pill with dark text (Bootstrap .btn-outline-light in its hover/active state).
  "outline-light":
    "border border-bs-light bg-bs-light font-bold tracking-[0.8px] text-black hover:border-bs-light-hover-border hover:bg-bs-light-hover",
  dark: "border-2 border-ink/65 bg-ink/[0.04] font-bold tracking-[0.8px] text-ink hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white hover:shadow-btn-dark-hover",
  "bs-dark":
    "border border-bs-dark bg-bs-dark font-bold tracking-[0.3px] text-white hover:border-bs-dark-hover-border hover:bg-bs-dark-hover",
  light:
    "border border-bs-light bg-bs-light font-bold tracking-[0.3px] text-primary-gold hover:border-bs-light-hover-border hover:bg-bs-light-hover",
  apply:
    "rounded-full border-0 bg-dark-black font-semibold normal-case tracking-normal text-white hover:bg-primary-gold hover:text-white",
  details:
    "rounded-full border border-dark-black bg-dark-black font-semibold tracking-[1px] text-primary-gold hover:-translate-y-0.5 hover:border-primary-gold hover:bg-primary-gold hover:text-white hover:shadow-details-hover",
};

export default function Button({
  children,
  variant = "solid",
  size = "md",
  iconLeft,
  iconRight,
  className,
  href,
  type,
  onClick,
  disabled,
}: ButtonProps) {
  const classes = clsx(
    base,
    sizeClasses[size],
    variantClasses[variant],
    disabled && "pointer-events-none opacity-70",
    className
  );

  const content = (
    <>
      {iconLeft ? <i className={iconLeft} aria-hidden="true" /> : null}
      {children}
      {iconRight ? <i className={iconRight} aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes} aria-disabled={disabled}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
