import Image from "next/image";
import type { SignatureProject } from "@/lib/data/signatureProjects";

export default function SignatureProjectCard({ image, title, city, price }: SignatureProject) {
  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]">
      <div className="relative h-[220px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-4 top-4 rounded bg-primary-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {city}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-dark-black transition-colors group-hover:text-primary-gold">
          {title}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary-gold">{price}</p>
      </div>
    </div>
  );
}
