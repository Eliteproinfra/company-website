import Image from "next/image";
import type { CategoryItem } from "@/lib/types";

/** Live `.category-card`: 12px radius, image scales 1.1 on hover, black->transparent overlay,
 *  gold pill `.category-badge` (20px radius, white uppercase text). */
export default function CategoryCard({ image, badge, title, subtitle }: CategoryItem) {
  return (
    <div className="group relative h-80 cursor-pointer overflow-hidden rounded-xl">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition-transform duration-[600ms] group-hover:scale-110"
      />
      <span className="absolute left-5 top-5 rounded-[20px] bg-primary-gold px-[15px] py-[5px] text-[0.8rem] font-semibold uppercase text-white">
        {badge}
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-5 text-white">
        <h4 className="text-xl font-bold">{title}</h4>
        <p className="text-sm text-white/50">{subtitle}</p>
      </div>
    </div>
  );
}
