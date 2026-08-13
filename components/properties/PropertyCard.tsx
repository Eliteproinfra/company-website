import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { PropertyItem } from "@/lib/types";

const badgeClasses: Record<PropertyItem["badgeVariant"], string> = {
  residential: "bg-primary-gold",
  commercial: "bg-black/70",
  sco: "bg-green-600",
  industrial: "bg-neutral-600",
};

export default function PropertyCard({
  image,
  badgeText,
  badgeVariant,
  title,
  location,
  beds,
  area,
  price,
  href,
  detailsLabel = "View Details",
}: PropertyItem & { detailsLabel?: string }) {
  const target = href ?? "/contact";

  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]">
      <Link href={target} className="relative block h-[250px] overflow-hidden" tabIndex={-1}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span
          className={clsx(
            "absolute left-4 top-4 rounded px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white",
            badgeClasses[badgeVariant]
          )}
        >
          {badgeText}
        </span>
      </Link>
      <div className="p-6">
        <h3 className="text-lg font-bold text-dark-black transition-colors group-hover:text-primary-gold">
          <Link href={target}>{title}</Link>
        </h3>
        <p className="mt-3 flex items-center gap-2 border-b border-neutral-100 pb-4 text-sm text-neutral-500">
          <i className="fas fa-map-marker-alt" aria-hidden="true" /> {location}
        </p>
        {beds || area ? (
          <div className="mt-4 flex items-center gap-5 text-sm text-neutral-600">
            {beds ? (
              <span className="flex items-center gap-1">
                <i className="fas fa-bed text-primary-gold" aria-hidden="true" /> {beds}
              </span>
            ) : null}
            {area ? (
              <span className="flex items-center gap-1">
                <i className="fas fa-ruler-combined text-primary-gold" aria-hidden="true" /> {area}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-primary-gold">{price}</span>
          <Button href={target} variant="dark" size="sm">
            {detailsLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
