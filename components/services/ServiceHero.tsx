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
};

export default function ServiceHero({
  image,
  eyebrow,
  heading,
  description,
  primaryCta,
  secondaryCta,
}: ServiceHeroProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-dark-black">
      <Image src={image} alt="" fill preload sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      <div className="container relative z-10">
        <div className="max-w-2xl border-l-4 border-primary-gold pl-6 sm:pl-10">
          <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="mt-6 max-w-lg text-lg text-white/70">{description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={primaryCta.href}>{primaryCta.label}</Button>
            <Button href={secondaryCta.href} variant="outline-light">
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
