import Image from "next/image";
import type { Pillar } from "@/lib/data/socialCommitment";

export default function PillarCard({ image, icon, title, description }: Pillar) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="p-6">
        <i className={`${icon} text-2xl text-primary-gold`} aria-hidden="true" />
        <h3 className="mt-3 text-lg font-bold text-dark-black">{title}</h3>
        <p className="mt-2 text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
