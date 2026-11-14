import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Faq from "@/components/home/Faq";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyEnquiryForm from "@/components/properties/PropertyEnquiryForm";
import PropertyFloorPlans from "@/components/properties/PropertyFloorPlans";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyNearby from "@/components/properties/PropertyNearby";
import PropertyReviews from "@/components/properties/PropertyReviews";
import PropertySectionNav from "@/components/properties/PropertySectionNav";
import ReadMore from "@/components/properties/ReadMore";
import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import {
  getProperties,
  getPropertyById,
  getPropertyBySlug,
  toPropertyItem,
} from "@/lib/content/properties";
import { amenityCatalog, amenityKey } from "@/lib/data/amenityCatalog";
import { keyFactIcon } from "@/lib/data/keyFacts";
import type {
  PropertyAmenity,
  PropertyDetail,
  PropertyDeveloper,
} from "@/lib/data/propertyDetails";
import { videoEmbedUrl } from "@/lib/video";

/** Prerenders every listing that exists at build time. A listing added in the
 *  admin afterwards is rendered on first request (dynamicParams defaults to true)
 *  and then revalidated by savePropertyAction. */
export async function generateStaticParams() {
  return (await getProperties()).map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };

  const description =
    property.description ||
    `${property.title} — ${property.category} project in ${property.location}. Price ${property.price}. Get floor plans, pricing and site-visit assistance from ElitePro Infra.`;

  return {
    title: property.title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      images: property.images.length ? [{ url: property.images[0], alt: property.title }] : undefined,
    },
  };
}

const CARD =
  "rounded-2xl border border-black/[0.06] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]";

/**
 * One numbered block of the page. The number comes from the block's position
 * among the blocks this listing actually has, so the sequence never skips
 * (a listing with no floor plans goes 01 Overview, 02 Amenities, ...).
 * `scroll-mt` keeps the heading clear of the fixed navbar and the sticky tabs
 * when a tab jumps here.
 */
function Section({
  id,
  index,
  title,
  subtitle,
  children,
}: {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${CARD} mb-6 scroll-mt-36 overflow-hidden`}>
      <header className="flex items-center gap-4 border-b border-black/[0.06] bg-linear-to-r from-gold-tint/70 to-white px-5 py-4 sm:px-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dark-black text-sm font-extrabold text-primary-gold">
          {String(index).padStart(2, "0")}
        </span>
        <div>
          <h2 className="text-[1.15rem] font-extrabold text-dark-black">{title}</h2>
          <p className="text-[0.88rem] text-muted">{subtitle}</p>
        </div>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-muted">
      <span className="h-[2px] w-5 bg-primary-gold" />
      {children}
    </h3>
  );
}

/**
 * Amenities under the heading of the catalog group they belong to, in the
 * catalog's own order, the way the portals present them.
 *
 * A name the catalog does not know — one typed in before the picker existed,
 * or added through "Add your own" — falls into a trailing "Other" group rather
 * than being dropped, and keeps whatever icon it was saved with.
 *
 * A name the catalog does know is drawn with the catalog's icon rather than the
 * stored one. Listings written before the amenity picker paired the two have
 * icons that contradict their labels — a swimming pool beside "CCTV
 * surveillance" — and resolving here fixes every one of them without anyone
 * having to open and re-save the listing.
 */
function groupAmenities(amenities: PropertyAmenity[]) {
  const groups = amenityCatalog
    .map((group) => ({
      title: group.title,
      items: group.items
        .filter((item) => amenities.some((a) => amenityKey(a.name) === amenityKey(item.name)))
        .map((item) => {
          const saved = amenities.find((a) => amenityKey(a.name) === amenityKey(item.name));
          // The saved name is kept — only the icon comes from the catalog, so
          // the page still prints exactly what the admin typed.
          return { icon: item.icon, name: saved?.name ?? item.name };
        }),
    }))
    .filter((group) => group.items.length > 0);

  const known = new Set(
    amenityCatalog.flatMap((group) => group.items.map((item) => amenityKey(item.name))),
  );
  const other = amenities.filter((a) => !known.has(amenityKey(a.name)));
  if (other.length) groups.push({ title: "Other", items: other });

  return groups;
}

/** The three builder tiles under the developer blurb. Each one is left out when
 *  its figure is blank, and the row disappears when all three are. */
function DeveloperStats({ developer }: { developer: PropertyDeveloper }) {
  const stats = (
    [
      ["Experience", developer.experience, "Years", "fas fa-award"],
      ["Total projects", developer.projects, "", "fas fa-city"],
      ["Delivered", developer.delivered, "", "fas fa-key"],
    ] as const
  ).filter(([, value]) => Boolean(value));

  if (!stats.length) return null;

  return (
    <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map(([label, value, unit, icon]) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl bg-dark-black p-4 text-white"
        >
          <i className={`${icon} text-xl text-primary-gold`} aria-hidden="true" />
          <div>
            <dd className="text-[1.3rem] font-extrabold leading-none">
              {value}
              {unit ? <span className="ml-1 text-[0.8rem] font-semibold">{unit}</span> : null}
            </dd>
            <dt className="mt-1 text-[0.75rem] uppercase tracking-wide text-text-gray">{label}</dt>
          </div>
        </div>
      ))}
    </dl>
  );
}

type Block = { id: string; label: string; title: string; subtitle: string; body: ReactNode };

/**
 * The page's sections in the order a buyer reads a listing: what it is, what
 * you get, where it is, what it costs over time, who builds it, what others
 * say, and who to talk to. Blocks with nothing on record are dropped before
 * numbering.
 */
function buildBlocks(property: PropertyDetail): Block[] {
  const blocks: (Block | null)[] = [];
  const info = property.projectInfo;
  const snapshot = info
    ? (
        [
          ["Status", info.status, "fas fa-hard-hat"],
          ["Project size", info.size, "fas fa-vector-square"],
          ["Configurations", info.configurations, "fas fa-th-large"],
          ["Price range", info.priceRange, "fas fa-rupee-sign"],
          ["RERA No.", info.rera, "fas fa-certificate"],
        ] as const
      ).filter(([, value]) => Boolean(value))
    : [];

  // 1. Overview — description, the record, and the project snapshot together.
  if (property.description || property.specs.length || snapshot.length || info?.highlights.length) {
    blocks.push({
      id: "overview",
      label: "Overview",
      title: "Overview",
      subtitle: `About ${property.title}`,
      body: (
        <div className="space-y-7">
          {property.description ? <ReadMore text={property.description} /> : null}

          {property.specs.length ? (
            <div>
              <SubHeading>Property Information</SubHeading>
              <dl className="grid grid-cols-1 overflow-hidden rounded-xl border border-black/[0.06] sm:grid-cols-2">
                {property.specs.map((spec, index) => (
                  <div
                    key={`${spec.label}-${index}`}
                    className="flex items-baseline justify-between gap-4 border-b border-black/[0.06] px-4 py-3 odd:bg-neutral-50 sm:border-r sm:even:border-r-0"
                  >
                    <dt className="text-[0.88rem] text-muted">{spec.label}</dt>
                    <dd className="text-right text-[0.92rem] font-bold text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {snapshot.length ? (
            <div>
              <SubHeading>Project Snapshot</SubHeading>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {snapshot.map(([label, value, icon]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-black/[0.06] p-3.5 transition hover:border-primary-gold/50 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-tint text-secondary-gold">
                      <i className={icon} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[0.75rem] font-bold uppercase tracking-wide text-muted">
                        {label}
                      </dt>
                      <dd className="break-words text-[0.95rem] font-extrabold text-ink">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {info?.highlights.length ? (
            <div>
              <SubHeading>Highlights</SubHeading>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {info.highlights.map((highlight, index) => (
                  <li key={`${highlight}-${index}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-gold text-[0.6rem] text-white">
                      <i className="fas fa-check" aria-hidden="true" />
                    </span>
                    <span className="text-[0.92rem] text-muted-2">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ),
    });
  }

  // 2. Floor plans
  if (property.floorPlans?.length) {
    blocks.push({
      id: "floor-plans",
      label: "Floor Plans",
      title: "Floor Plans",
      subtitle: "Layouts and pricing per configuration",
      body: <PropertyFloorPlans plans={property.floorPlans} />,
    });
  }

  // 3. Amenities + furnishing
  if (property.amenities.length || property.furnishings?.length) {
    blocks.push({
      id: "amenities",
      label: "Amenities",
      title: "Amenities",
      subtitle: "Facilities available in this project",
      body: (
        <div className="space-y-7">
          {groupAmenities(property.amenities).map((group) => (
            <div key={group.title}>
              <SubHeading>{group.title}</SubHeading>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {group.items.map((amenity) => (
                  <div
                    key={amenity.name}
                    className="group flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-3 py-3 transition hover:-translate-y-0.5 hover:border-primary-gold/50 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-tint text-secondary-gold transition group-hover:bg-primary-gold group-hover:text-white">
                      <i className={amenity.icon} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-dark-black">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {property.furnishings?.length ? (
            <div>
              <SubHeading>Furnishing Details</SubHeading>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {property.furnishings.map((furnishing, index) => (
                  <div
                    key={`${furnishing.item}-${index}`}
                    className="rounded-xl border border-black/[0.06] bg-neutral-50 p-3 text-center"
                  >
                    <div className="text-[1.3rem] font-extrabold text-ink">
                      {furnishing.count || "—"}
                    </div>
                    <div className="mt-0.5 text-[0.82rem] text-muted">{furnishing.item}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ),
    });
  }

  // 4. Location — map first, then what's around.
  if (property.mapUrl || property.nearby?.length) {
    blocks.push({
      id: "location",
      label: "Location",
      title: "Location & Commute",
      subtitle: "Map and what is around the project",
      body: (
        <div className="space-y-6">
          {property.mapUrl ? (
            // Google share links (maps.app.goo.gl) refuse to be framed — only
            // real /maps/embed URLs can render inline.
            property.mapUrl.includes("/maps/embed") ? (
              <div className="aspect-[16/9] overflow-hidden rounded-xl border border-black/[0.06]">
                <iframe
                  src={property.mapUrl}
                  title="Location Map"
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <Button href={property.mapUrl} variant="outline" iconLeft="fas fa-map-marker-alt">
                View on Google Maps
              </Button>
            )
          ) : null}
          {property.nearby?.length ? <PropertyNearby items={property.nearby} /> : null}
        </div>
      ),
    });
  }

  // 5. Price trends
  if (property.priceTrends?.length) {
    blocks.push({
      id: "price-trends",
      label: "Price Trends",
      title: "Price Trends",
      subtitle: "Rates recorded for this project",
      body: (
        <>
          <div className="overflow-hidden rounded-xl border border-black/[0.06]">
            <table className="w-full text-left text-[0.92rem]">
              <thead className="bg-dark-black text-[0.75rem] uppercase tracking-wide text-white">
                <tr>
                  <th className="px-4 py-3 font-bold">Period</th>
                  <th className="px-4 py-3 font-bold">Rate</th>
                  <th className="px-4 py-3 text-right font-bold">Change</th>
                </tr>
              </thead>
              <tbody>
                {property.priceTrends.map((trend, index) => {
                  const down = trend.change.trim().startsWith("-");
                  return (
                    <tr
                      key={`${trend.period}-${index}`}
                      className="border-b border-black/[0.06] last:border-0 even:bg-neutral-50"
                    >
                      <td className="px-4 py-3 text-muted">{trend.period}</td>
                      <td className="px-4 py-3 font-bold text-ink">{trend.rate}</td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${down ? "text-red-600" : "text-green-600"}`}
                      >
                        <i
                          className={`fas fa-arrow-${down ? "down" : "up"} mr-1 text-xs`}
                          aria-hidden="true"
                        />
                        {trend.change}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            Figures are indicative and maintained by ElitePro Infra. They are not a valuation.
          </p>
        </>
      ),
    });
  }

  // 6. Videos
  if (property.videos?.length) {
    blocks.push({
      id: "videos",
      label: "Videos",
      title: "Videos",
      subtitle: "Walkthroughs and project films",
      body: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {property.videos.map((video, index) => {
            const embed = videoEmbedUrl(video.url);
            return (
              <div key={`${video.url}-${index}`}>
                {embed ? (
                  <div className="aspect-video overflow-hidden rounded-xl bg-neutral-100">
                    <iframe
                      src={embed}
                      title={video.title || `Video ${index + 1}`}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>
                ) : (
                  /* Not a YouTube or Vimeo address, so it cannot be framed —
                     see lib/video.ts. */
                  <Button href={video.url} variant="outline" iconLeft="fas fa-play">
                    {video.title || "Watch the video"}
                  </Button>
                )}
                {video.title && embed ? (
                  <p className="mt-2 text-sm font-semibold text-dark-black">{video.title}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ),
    });
  }

  // 7. Developer — hidden outright when the listing has none (the admin
  //    stores none at all when the name is left blank).
  if (property.developer) {
    const developer = property.developer;
    blocks.push({
      id: "developer",
      label: "Developer",
      title: "About Developer",
      subtitle: "Developer and compliance information",
      body: (
        <>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {developer.logo ? (
              <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                <Image
                  src={developer.logo}
                  alt={`${developer.name} logo`}
                  fill
                  sizes="144px"
                  className="object-contain p-3"
                />
              </div>
            ) : null}
            <div>
              <h3 className="text-lg font-bold text-dark-black">{developer.name}</h3>
              <p className="mt-2 leading-[1.9] text-muted-2">{developer.about}</p>
            </div>
          </div>
          <DeveloperStats developer={developer} />
        </>
      ),
    });
  }

  // 8. Reviews
  if (property.reviews?.length) {
    blocks.push({
      id: "reviews",
      label: "Reviews",
      title: "Reviews & Ratings",
      subtitle: "What buyers tell us",
      body: <PropertyReviews reviews={property.reviews} />,
    });
  }

  // 9. FAQs
  if (property.faqs.length) {
    blocks.push({
      id: "faqs",
      label: "FAQs",
      title: "FAQs",
      subtitle: "Common questions",
      body: <Faq items={property.faqs} className="w-full" />,
    });
  }

  // 10. Experts
  if (property.experts.length) {
    blocks.push({
      id: "experts",
      label: "Experts",
      title: "Top Experts",
      subtitle: "Talk to our property specialists",
      body: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {property.experts.map((expert) => (
            <div
              key={expert.email || expert.name}
              className="rounded-xl border border-black/[0.06] p-4 text-center transition hover:border-primary-gold/50 hover:shadow-md"
            >
              {expert.image ? (
                <Image
                  src={expert.image}
                  alt={expert.name}
                  width={72}
                  height={72}
                  className="mx-auto h-[72px] w-[72px] rounded-full object-cover ring-2 ring-primary-gold ring-offset-2"
                />
              ) : (
                <span className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-dark-black text-xl font-bold text-primary-gold">
                  {expert.name.replace(/^(Mr|Ms|Mrs)\.?\s*/i, "").charAt(0)}
                </span>
              )}
              <div className="mt-3 font-bold text-dark-black">{expert.name}</div>
              <div className="text-sm text-muted">{expert.role}</div>
              <div className="mt-4 flex gap-2">
                {expert.phone ? (
                  <a
                    href={`tel:${expert.phone}`}
                    className="flex-1 rounded-lg border-2 border-primary-gold/85 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-gold transition-colors hover:bg-primary-gold hover:text-dark-black"
                  >
                    Call
                  </a>
                ) : null}
                {expert.email ? (
                  <a
                    href={`mailto:${expert.email}`}
                    className="flex-1 rounded-lg border border-dark-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-dark-black transition-colors hover:bg-dark-black hover:text-white"
                  >
                    Email
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ),
    });
  }

  return blocks.filter((block): block is Block => Boolean(block));
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const related = (
    await Promise.all(property.relatedIds.map((id) => getPropertyById(id)))
  ).filter((item): item is PropertyDetail => Boolean(item));

  const blocks = buildBlocks(property);

  return (
    <section className="bg-neutral-50 pb-16 pt-24 lg:pt-28">
      <div className="mx-auto w-full max-w-[1600px] px-4 lg:px-10">
        {/* Header: title, location and price first, so the page opens on what
            the listing is before any photos. */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {property.category ? (
                <span className="rounded-full bg-dark-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-gold">
                  {property.category}
                </span>
              ) : null}
              {property.projectInfo?.status ? (
                <span className="rounded-full bg-badge-ready/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-badge-ready">
                  {property.projectInfo.status}
                </span>
              ) : null}
              {property.projectInfo?.rera ? (
                <span className="rounded-full border border-border-pill bg-white px-3 py-1 text-xs font-semibold text-dark-black">
                  <i className="fas fa-shield-alt mr-1.5 text-primary-gold" aria-hidden="true" />
                  RERA Registered
                </span>
              ) : null}
            </div>
            <h1 className="font-serif text-3xl font-bold text-dark-black md:text-[2.6rem] md:leading-tight">
              {property.title}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.95rem] text-muted">
              {property.location ? (
                <span>
                  <i className="fas fa-map-marker-alt mr-1.5 text-primary-gold" aria-hidden="true" />
                  {property.location}
                </span>
              ) : null}
              {property.developer?.name ? (
                <span>
                  <i className="fas fa-building mr-1.5 text-primary-gold" aria-hidden="true" />
                  by <strong className="text-dark-black">{property.developer.name}</strong>
                </span>
              ) : null}
            </p>
          </div>
          <div className="lg:text-right">
            <div className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-muted">
              Starting from
            </div>
            <div className="bg-gold-gradient bg-clip-text text-3xl font-extrabold text-transparent md:text-[2.2rem]">
              {property.price}
            </div>
            {property.priceNote ? (
              <div className="text-sm text-muted">{property.priceNote}</div>
            ) : null}
          </div>
        </div>

        <div className={`${CARD} mb-5 p-3 sm:p-4`}>
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {property.keyFacts?.length ? (
          <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3 lg:grid-cols-6 [&>*]:bg-dark-black">
            {property.keyFacts.map((fact, index) => (
              <div key={`${fact.label}-${index}`} className="flex items-center gap-3 px-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-gold/15 text-primary-gold">
                  <i className={keyFactIcon(fact.label)} aria-hidden="true" />
                </span>
                {/* No truncation: "Ready To Move" and "North East" wrap instead. */}
                <div className="min-w-0">
                  <div className="text-[0.98rem] font-extrabold leading-tight text-white">
                    {fact.value}
                  </div>
                  <div className="text-[0.75rem] leading-tight text-text-gray">{fact.label}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <PropertySectionNav sections={blocks.map(({ id, label }) => ({ id, label }))} />
            {blocks.map((block, index) => (
              <Section
                key={block.id}
                id={block.id}
                index={index + 1}
                title={block.title}
                subtitle={block.subtitle}
              >
                {block.body}
              </Section>
            ))}
          </div>

          <aside className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className={`${CARD} overflow-hidden`}>
                <div className="bg-dark-black px-6 py-5 text-white">
                  <div className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-text-gray">
                    Price
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-primary-gold">
                    {property.price}
                  </div>
                  {property.priceNote ? (
                    <div className="mt-1 text-sm text-text-gray">{property.priceNote}</div>
                  ) : null}
                </div>
                <div className="grid gap-2.5 p-5">
                  <Button href="tel:+919968686868" variant="solid" iconLeft="fas fa-phone-alt">
                    Call Now
                  </Button>
                  <Button href="mailto:info@eliteproinfra.com" variant="dark" iconLeft="fas fa-envelope">
                    Email Us
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-dark-black p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                <PropertyEnquiryForm propertyTitle={property.title} />
              </div>
            </div>
          </aside>
        </div>

        {related.length ? (
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="mb-2 font-serif text-3xl font-bold text-dark-black">
                  Related Properties
                </h2>
                <Separator align="left" width={80} />
              </div>
              <Button href="/properties" variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <PropertyCard key={item.id} {...toPropertyItem(item)} detailsLabel="View" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
