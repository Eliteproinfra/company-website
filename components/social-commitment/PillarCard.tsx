import Image from "next/image";
import Link from "next/link";
import type { Pillar } from "@/lib/data/socialCommitment";

/** Live `.csr-pillars-card`: #101015, 20px radius, 0 25px 60px rgba(0,0,0,.5); gold tag,
 *  white title, rgba(255,255,255,.75) text, gold "Learn More" link whose arrow nudges right on
 *  hover, rgba(255,255,255,.12) icon circle overlapping the image. */
export default function PillarCard({ image, icon, tag, title, description }: Pillar) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-csr-card text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
      <div className="relative h-[230px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.08]"
        />
      </div>
      <div className="relative px-6 pb-5 pt-[22px]">
        <span className="absolute -top-6 right-5 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/[0.12] text-primary-gold">
          <i className={icon} aria-hidden="true" />
        </span>
        <p className="text-[0.8rem] uppercase tracking-[1.8px] text-primary-gold">{tag}</p>
        <h3 className="mt-1.5 text-[1.2rem] font-bold text-white">{title}</h3>
        <p className="mt-2 mb-3 text-[0.95rem] text-white/75">{description}</p>
        <Link href="/contact" className="text-[0.9rem] font-semibold text-primary-gold">
          Learn More
          <i
            className="fas fa-arrow-right ml-1 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
