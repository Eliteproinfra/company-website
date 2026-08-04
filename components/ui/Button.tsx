import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "outline-light";
type Size = "md" | "sm";

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
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-[0.8px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold focus-visible:ring-offset-2";

const sizeClasses: Record<Size, string> = {
  md: "px-[22px] py-3 text-sm",
  sm: "px-4 py-2 text-xs",
};

const variantClasses: Record<Variant, string> = {
  solid:
    "border border-black/10 bg-gradient-to-br from-primary-gold to-secondary-gold text-[#111827] shadow-[0_10px_22px_rgba(212,175,55,0.18),0_6px_16px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-[0_14px_28px_rgba(212,175,55,0.25),0_10px_20px_rgba(0,0,0,0.12)]",
  outline:
    "border-2 border-primary-gold/85 bg-primary-gold/10 text-primary-gold hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary-gold hover:to-secondary-gold hover:text-[#111827] hover:shadow-[0_12px_22px_rgba(212,175,55,0.22),0_10px_18px_rgba(0,0,0,0.10)]",
  "outline-light":
    "border-2 border-white/80 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white hover:text-dark-black",
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
