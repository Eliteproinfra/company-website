import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { PropertyItem } from "@/lib/types";

/*
 * Badge colours from live: home `.property-badge.bg-dark` = #212529; listing `.status-badge`
 * = rgba(0,0,0,.7) for every category. Listing cards use `.btn-outline-gold` for the details
 * link while home cards use the `.property-details .btn` dark pill.
 */
type PropertyCardProps = PropertyItem & {
  detailsLabel?: string;
  /**
   * `compact` = live home `.property-card`: #fff, no border, square corners,
   * 0 5px 15px rgba(0,0,0,.05), image scales on hover, badge #212529.
   * `listing` = live `.property-card-lg`: #fff, 1px #eee, square corners,
   * 0 10px 30px rgba(0,0,0,.05); hover lifts 5px with 0 15px 40px rgba(0,0,0,.1).
   */
  variant?: "compact" | "listing";
};

export default function PropertyCard({
  image,
  badgeText,
  title,
  location,
  beds,
  area,
  price,
  href,
  detailsLabel = "View Details",
  variant = "listing",
}: PropertyCardProps) {
  const target = href ?? "/contact";
  const compact = variant === "compact";

  return (
    <div
      className={clsx(
        "group h-full overflow-hidden bg-white transition-all duration-300",
        compact
          ? "shadow-card-15"
          : "border border-border-card shadow-card-lg hover:-translate-y-[5px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
      )}
    >
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
            "absolute left-[15px] top-[15px] px-3 py-[5px] text-xs font-semibold uppercase tracking-wide text-white",
            compact ? "bg-bs-dark" : "rounded bg-black/70"
          )}
        >
          {badgeText}
        </span>
      </Link>
      <div className={compact ? "p-[15px]" : "p-6"}>
        <h3 className="text-lg font-bold text-bs-dark">
          <Link href={target}>{title}</Link>
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-bs-muted">
          <i className="fas fa-map-marker-alt text-primary-gold" aria-hidden="true" /> {location}
        </p>
        {beds || area ? (
          <div className="mt-3 flex items-center gap-[15px] text-sm text-muted">
            {beds ? (
              <span className="flex items-center gap-1.5">
                <i className="fas fa-bed text-primary-gold" aria-hidden="true" /> {beds}
              </span>
            ) : null}
            {area ? (
              <span className="flex items-center gap-1.5">
                <i className="fas fa-ruler-combined text-primary-gold" aria-hidden="true" /> {area}
              </span>
            ) : null}
          </div>
        ) : null}
        <hr className="my-4 border-t border-bs-dark/25" />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[1.2rem] font-bold text-primary-gold">{price}</span>
          {compact ? (
            <Button href={target} variant="details" size="xs">
              {detailsLabel}
            </Button>
          ) : (
            <Button href={target} variant="outline" size="sm">
              {detailsLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
