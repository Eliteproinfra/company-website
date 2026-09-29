import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

type ServiceHeroProps = {
  image: string;
  eyebrow: string;
  heading: ReactNode;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /**
   * Overlay classes copied from the live hero: investment `90deg .8 -> .4`,
   * nri-advisory `.6 -> .4`, land `.7 -> rgba(26,26,26,.9)`, career `.5 -> .8`,
   * nri-corner `.5 -> .7`, property-management `to right .9 -> .4`.
   */
  overlay?: string;
  /** Live heroes with `background-attachment: fixed` render as a CSS background. */
  fixed?: boolean;
  /** Live `.nri-corner-hero::after`: 100px fade to white at the bottom. */
  fadeToWhite?: boolean;
  /** Live `.land-hero::before`: faint gold grid over the photo. */
  pattern?: boolean;
  /** `.career-hero` centres its copy; the other service heroes are left-aligned with a gold bar. */
  align?: "left" | "center";
  /** `.nri-hero-premium .badge-premium`: frosted pill instead of the plain gold eyebrow. */
  eyebrowStyle?: "text" | "badge";
  /** Drop the gold left bar (live `.nri-corner-hero` has none). */
  plainBar?: boolean;
  /** Second button style: live uses `.btn-outline-light` on most pages. */
  secondaryVariant?: "outline-light" | "outline";
  minHeight?: string;
};

export default function ServiceHero({
  image,
  eyebrow,
  heading,
  description,
  primaryCta,
  secondaryCta,
  overlay = "bg-linear-to-r from-black/90 to-black/40",
  fixed = false,
  fadeToWhite = false,
  pattern = false,
  align = "left",
  eyebrowStyle = "text",
  secondaryVariant = "outline-light",
  plainBar = false,
  minHeight = "min-h-[80vh]",
}: ServiceHeroProps) {
  const centered = align === "center";

  return (
    <section
      className={clsx(
        "relative flex items-center overflow-hidden bg-dark-black",
        minHeight,
        fixed && "bg-cover bg-center bg-fixed"
      )}
      style={fixed ? { backgroundImage: `url(${image})` } : undefined}
    >
      {fixed ? null : (
        <Image src={image} alt="" fill preload sizes="100vw" className="object-cover" />
      )}
      <div className={clsx("absolute inset-0", overlay)} aria-hidden="true" />
      {pattern ? <div className="absolute inset-0 bg-land-grid" aria-hidden="true" /> : null}
      {fadeToWhite ? (
        <div
          className="absolute inset-x-0 bottom-0 h-[100px] bg-linear-to-t from-white to-transparent"
          aria-hidden="true"
        />
      ) : null}
      <div className="container relative z-10">
        <div
          className={clsx(
            centered
              ? "mx-auto max-w-3xl text-center"
              : plainBar
                ? "max-w-3xl"
                : "max-w-2xl border-l-4 border-primary-gold pl-6 sm:pl-10"
          )}
        >
          {eyebrowStyle === "badge" ? (
            <p className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-[25px] py-2.5 text-[0.9rem] uppercase tracking-[2px] text-primary-gold backdrop-blur-[10px]">
              {eyebrow}
            </p>
          ) : (
            <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">{eyebrow}</p>
          )}
          <h1
            className={clsx(
              "mt-3 text-4xl font-bold text-white sm:text-5xl lg:text-6xl",
              centered && "[text-shadow:2px_2px_10px_rgba(0,0,0,0.5)]"
            )}
          >
            {heading}
          </h1>
          <p
            className={clsx(
              "mt-6 text-lg",
              centered ? "mx-auto max-w-2xl text-white/90" : "max-w-lg text-white/90"
            )}
          >
            {description}
          </p>
          <div className={clsx("mt-8 flex flex-wrap gap-4", centered && "justify-center")}>
            <Button href={primaryCta.href}>{primaryCta.label}</Button>
            <Button href={secondaryCta.href} variant={secondaryVariant}>
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
