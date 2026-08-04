import Image from "next/image";
import type { CategoryItem } from "@/lib/types";

export default function CategoryCard({ image, badge, title, subtitle }: CategoryItem) {
  return (
    <div className="group relative h-80 cursor-pointer overflow-hidden rounded-2xl">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <span className="absolute left-5 top-5 rounded-full bg-primary-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        {badge}
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>
    </div>
  );
}
