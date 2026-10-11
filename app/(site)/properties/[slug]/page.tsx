import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Faq from "@/components/home/Faq";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyEnquiryForm from "@/components/properties/PropertyEnquiryForm";
import PropertyFloorPlans from "@/components/properties/PropertyFloorPlans";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyNearby from "@/components/properties/PropertyNearby";
import PropertyReviews from "@/components/properties/PropertyReviews";
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
    `${property.title} — ${property.category} project in ${property.location}. Price ${property.price}. Get floor plans, pricing and site-visit assistance from Elite Pro Infraventure.`;

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

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[14px] border border-black/[0.06] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-black/[0.06] px-[18px] py-4">
      <h2 className="text-[1.05rem] font-extrabold text-dark-black">{title}</h2>
      <p className="mt-1 text-[0.92rem] text-muted">{subtitle}</p>
    </div>
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
      ["Experience", developer.experience, "Years"],
      ["Total projects", developer.projects, ""],
      ["Delivered", developer.delivered, ""],
    ] as const
  ).filter(([, value]) => Boolean(value));

  if (!stats.length) return null;

  return (
    <dl className="mt-4 grid grid-cols-3 gap-3">
      {stats.map(([label, value, unit]) => (
        <div key={label} className="rounded-xl border border-black/[0.06] p-3 text-center">
          <dd className="text-[1.3rem] font-extrabold text-ink">
            {value}
            {unit ? <span className="ml-1 text-[0.8rem]">{unit}</span> : null}
          </dd>
          <dt className="mt-0.5 text-[0.78rem] text-muted">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

function Badges({ property }: { property: PropertyDetail }) {
  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {property.category ? (
        <span className="rounded bg-dark-black px-2.5 py-1 text-xs font-semibold text-white">
          {property.category}
        </span>
      ) : null}
      {property.location ? (
        <span className="rounded border border-border-pill bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-dark-black">
          {property.location}
        </span>
      ) : null}
    </div>
  );
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

  return (
    <section className="bg-white pb-16 pt-28 lg:pt-32">
      <div className="mx-auto w-full max-w-[1600px] px-4 lg:px-10">
        <Card className="mb-4 p-[18px]">
          <PropertyGallery images={property.images} title={property.title} />
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-4 p-[18px]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badges property={property} />
                  <h1 className="text-xl font-bold text-dark-black">{property.title}</h1>
                </div>
                <div className="text-right">
                  <div className="text-[1.4rem] font-bold text-dark-black">{property.price}</div>
                  {property.priceNote ? (
                    <div className="text-sm text-muted">{property.priceNote}</div>
                  ) : null}
                </div>
              </div>

              {property.keyFacts?.length ? (
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/[0.06] pt-4 sm:grid-cols-3 lg:grid-cols-4">
                  {property.keyFacts.map((fact, index) => (
                    <div key={`${fact.label}-${index}`} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-gold/10 text-primary-gold">
                        <i className={keyFactIcon(fact.label)} aria-hidden="true" />
                      </span>
                      {/* No truncation: "Ready To Move" and "North East" have
                          to survive a four-column row, so these wrap instead. */}
                      <div className="min-w-0">
                        <div className="text-[0.98rem] font-extrabold leading-tight text-ink">
                          {fact.value}
                        </div>
                        <div className="text-[0.78rem] leading-tight text-muted">{fact.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>

            {property.specs.length ? (
              <Card className="mb-4">
                <CardHeader
                  title="Property Information"
                  subtitle="Everything on record for this listing"
                />
                <div className="p-[18px]">
                  <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                    {property.specs.map((spec, index) => (
                      <div
                        key={`${spec.label}-${index}`}
                        className="flex items-baseline justify-between gap-4 border-b border-black/[0.06] py-2.5"
                      >
                        <dt className="text-[0.88rem] text-muted">{spec.label}</dt>
                        <dd className="text-right text-[0.92rem] font-bold text-ink">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Card>
            ) : null}

            {property.description ? (
              <Card className="mb-4">
                <CardHeader title="Property Description" subtitle="About the project" />
                <div className="p-[18px]">
                  <p className="leading-[1.9] text-muted">{property.description}</p>
                </div>
              </Card>
            ) : null}

            {property.floorPlans?.length ? (
              <Card className="mb-4">
                <CardHeader title="Floor Plans" subtitle="Layouts and pricing per configuration" />
                <div className="p-[18px]">
                  <PropertyFloorPlans plans={property.floorPlans} />
                </div>
              </Card>
            ) : null}

            {property.amenities.length ? (
              <Card className="mb-4">
                <CardHeader title="Amenities" subtitle="Facilities available in this project" />
                <div className="space-y-5 p-[18px]">
                  {groupAmenities(property.amenities).map((group) => (
                    <div key={group.title}>
                      <h3 className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-wide text-muted">
                        {group.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {group.items.map((amenity) => (
                          <div
                            key={amenity.name}
                            className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-3 py-3"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-gold/10 text-primary-gold">
                              <i className={amenity.icon} aria-hidden="true" />
                            </span>
                            <span className="text-sm font-semibold text-dark-black">
                              {amenity.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {property.furnishings?.length ? (
              <Card className="mb-4">
                <CardHeader title="Furnishing Details" subtitle="What the unit comes with" />
                <div className="p-[18px]">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {property.furnishings.map((furnishing, index) => (
                      <div
                        key={`${furnishing.item}-${index}`}
                        className="rounded-xl border border-black/[0.06] p-3 text-center"
                      >
                        <div className="text-[1.3rem] font-extrabold text-ink">
                          {furnishing.count || "—"}
                        </div>
                        <div className="mt-0.5 text-[0.82rem] text-muted">{furnishing.item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}

            {property.nearby?.length ? (
              <Card className="mb-4">
                <CardHeader title="Locality & Commute" subtitle="What is around the project" />
                <div className="p-[18px]">
                  <PropertyNearby items={property.nearby} />
                </div>
              </Card>
            ) : null}

            {property.mapUrl ? (
              <Card className="mb-4">
                <CardHeader title="Location & Landmark" subtitle="Map and nearby highlights" />
                <div className="p-[18px]">
                  {/* Google share links (maps.app.goo.gl) refuse to be framed —
                      only real /maps/embed URLs can render inline. */}
                  {property.mapUrl.includes("/maps/embed") ? (
                    <div className="aspect-[4/3] overflow-hidden rounded-xl">
                      <iframe
                        src={property.mapUrl}
                        title="Location Map"
                        loading="lazy"
                        className="h-full w-full border-0"
                      />
                    </div>
                  ) : (
                    <Button
                      href={property.mapUrl}
                      variant="outline"
                      iconLeft="fas fa-map-marker-alt"
                    >
                      View on Google Maps
                    </Button>
                  )}
                </div>
              </Card>
            ) : null}

            {property.projectInfo ? (
              <Card className="mb-4">
                <CardHeader
                  title={`About ${property.title}`}
                  subtitle="Project snapshot"
                />
                <div className="p-[18px]">
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["Status", property.projectInfo.status],
                        ["Project size", property.projectInfo.size],
                        ["Configurations", property.projectInfo.configurations],
                        ["Price range", property.projectInfo.priceRange],
                        ["RERA No.", property.projectInfo.rera],
                      ] as const
                    )
                      .filter(([, value]) => Boolean(value))
                      .map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-black/[0.06] p-3">
                          <dt className="text-[0.78rem] font-bold text-muted">{label}</dt>
                          <dd className="mt-0.5 text-[0.98rem] font-extrabold text-ink">{value}</dd>
                        </div>
                      ))}
                  </dl>

                  {property.projectInfo.highlights.length ? (
                    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {property.projectInfo.highlights.map((highlight, index) => (
                        <li key={`${highlight}-${index}`} className="flex items-start gap-2.5">
                          <i
                            className="fas fa-check mt-1 text-sm text-primary-gold"
                            aria-hidden="true"
                          />
                          <span className="text-[0.92rem] text-muted">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Card>
            ) : null}

            {/* Hidden outright when the listing has no developer — the admin stores
                none at all when the name is left blank. */}
            {property.developer ? (
              <Card className="mb-4">
                <CardHeader title="About Developer" subtitle="Developer and compliance information" />
                <div className="p-[18px]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {property.developer.logo ? (
                      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                        <Image
                          src={property.developer.logo}
                          alt={`${property.developer.name} logo`}
                          fill
                          sizes="128px"
                          className="object-contain p-2"
                        />
                      </div>
                    ) : null}
                    <div>
                      <h3 className="text-lg font-bold text-dark-black">{property.developer.name}</h3>
                      <p className="mt-2 leading-[1.9] text-muted">{property.developer.about}</p>
                    </div>
                  </div>

                  <DeveloperStats developer={property.developer} />
                </div>
              </Card>
            ) : null}

            {property.videos?.length ? (
              <Card className="mb-4">
                <CardHeader title="Videos" subtitle="Walkthroughs and project films" />
                <div className="grid grid-cols-1 gap-4 p-[18px] md:grid-cols-2">
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
                          <p className="mt-2 text-sm font-semibold text-dark-black">
                            {video.title}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : null}

            {property.priceTrends?.length ? (
              <Card className="mb-4">
                <CardHeader title="Price Trends" subtitle="Rates recorded for this project" />
                <div className="p-[18px]">
                  <table className="w-full text-left text-[0.92rem]">
                    <thead>
                      <tr className="border-b border-black/[0.06] text-[0.78rem] uppercase tracking-wide text-muted">
                        <th className="py-2 font-bold">Period</th>
                        <th className="py-2 font-bold">Rate</th>
                        <th className="py-2 text-right font-bold">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.priceTrends.map((trend, index) => (
                        <tr
                          key={`${trend.period}-${index}`}
                          className="border-b border-black/[0.06] last:border-0"
                        >
                          <td className="py-2.5 text-muted">{trend.period}</td>
                          <td className="py-2.5 font-bold text-ink">{trend.rate}</td>
                          <td
                            className={`py-2.5 text-right font-bold ${
                              trend.change.trim().startsWith("-") ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {trend.change}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 text-xs text-muted">
                    Figures are indicative and maintained by Elite Pro Infraventure. They are not
                    a valuation.
                  </p>
                </div>
              </Card>
            ) : null}

            {property.reviews?.length ? (
              <Card className="mb-4">
                <CardHeader title="Reviews & Ratings" subtitle="What buyers tell us" />
                <div className="p-[18px]">
                  <PropertyReviews reviews={property.reviews} />
                </div>
              </Card>
            ) : null}

            {property.faqs.length ? (
              <Card className="mb-4">
                <CardHeader title="FAQs" subtitle="Common questions" />
                <div className="p-[18px]">
                  <Faq items={property.faqs} className="w-full" />
                </div>
              </Card>
            ) : null}

            {property.experts.length ? (
              <Card className="mb-4">
                <CardHeader title="Top Experts" subtitle="Talk to our property specialists" />
                <div className="p-[18px]">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {property.experts.map((expert) => (
                      <div key={expert.email || expert.name} className="rounded-xl border border-border-pill p-3">
                        <div className="flex items-center gap-3">
                          {expert.image ? (
                            <Image
                              src={expert.image}
                              alt={expert.name}
                              width={56}
                              height={56}
                              className="h-14 w-14 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-bold text-dark-black">
                              {expert.name.replace(/^(Mr|Ms|Mrs)\.?\s*/i, "").charAt(0)}
                            </span>
                          )}
                          <div>
                            <div className="font-bold text-dark-black">{expert.name}</div>
                            <div className="text-sm text-muted">{expert.role}</div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          {expert.phone ? (
                            <a
                              href={`tel:${expert.phone}`}
                              className="flex-1 rounded-lg border-2 border-primary-gold/85 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-primary-gold transition-colors hover:bg-primary-gold hover:text-dark-black"
                            >
                              Call
                            </a>
                          ) : null}
                          {expert.email ? (
                            <a
                              href={`mailto:${expert.email}`}
                              className="flex-1 rounded-lg border border-dark-black px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-dark-black transition-colors hover:bg-dark-black hover:text-white"
                            >
                              Email
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : null}

            {related.length ? (
              <div className="py-2">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-dark-black">Related Properties</h2>
                    <Separator align="left" width={80} />
                  </div>
                  <Button href="/properties" variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => (
                    <PropertyCard key={item.id} {...toPropertyItem(item)} detailsLabel="View" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <Card className="mb-4 p-6">
                <Badges property={property} />
                <div className="text-2xl font-bold text-dark-black">{property.price}</div>
                {property.priceNote ? (
                  <div className="mb-4 mt-1 text-muted">{property.priceNote}</div>
                ) : null}
                <div className="grid gap-2">
                  <Button href="tel:+919968686868" variant="outline">
                    Call Now
                  </Button>
                  <Button href="mailto:info@eliteproinfra.com" variant="dark">
                    Email
                  </Button>
                </div>
              </Card>

              <div className="rounded-[14px] bg-dark-black p-6 text-white">
                <PropertyEnquiryForm propertyTitle={property.title} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
