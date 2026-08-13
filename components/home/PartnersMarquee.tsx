import Image from "next/image";
import type { Partner } from "@/lib/data/partners";

export default function PartnersMarquee({ partners }: { partners: Partner[] }) {
  const loop = [...partners, ...partners];

  return (
    <div className="group overflow-hidden">
      <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
        {loop.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-white p-4 grayscale transition-all hover:grayscale-0"
          >
            <Image
              src={partner.image}
              alt={partner.name}
              width={140}
              height={70}
              className="h-auto max-h-14 w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
