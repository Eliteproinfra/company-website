import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Faq from "@/components/home/Faq";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyEnquiryForm from "@/components/properties/PropertyEnquiryForm";
import PropertyGallery from "@/components/properties/PropertyGallery";
import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import {
  getPropertyById,
  getPropertyBySlug,
  propertyDetails,
  type PropertyDetail,
} from "@/lib/data/propertyDetails";

export function generateStaticParams() {
  return propertyDetails.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
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
      <p className="mt-1 text-[0.92rem] text-neutral-500">{subtitle}</p>
    </div>
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
        <span className="rounded border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-dark-black">
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
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const related = property.relatedIds
    .map((id) => getPropertyById(id))
    .filter((item): item is PropertyDetail => Boolean(item));

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
                    <div className="text-sm text-neutral-500">{property.priceNote}</div>
                  ) : null}
                </div>
              </div>
            </Card>

            <Card className="mb-4">
              <CardHeader title="Property Overview" subtitle="Key facts about this listing" />
              <div className="p-[18px]">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {property.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-black/[0.06] bg-white p-3"
                    >
                      <div className="text-[0.78rem] font-bold text-neutral-500">{spec.label}</div>
                      <div className="mt-0.5 text-[0.98rem] font-extrabold text-[#111827]">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {property.description ? (
              <Card className="mb-4">
                <CardHeader title="Property Description" subtitle="About the project" />
                <div className="p-[18px]">
                  <p className="leading-[1.9] text-neutral-500">{property.description}</p>
                </div>
              </Card>
            ) : null}

            {property.amenities.length ? (
              <Card className="mb-4">
                <CardHeader title="Amenities" subtitle="Facilities available in this project" />
                <div className="p-[18px]">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {property.amenities.map((amenity) => (
                      <div
                        key={amenity.name}
                        className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-3 py-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-gold/10 text-primary-gold">
                          <i className={amenity.icon} aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold text-dark-black">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
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
                    <p className="mt-2 leading-[1.9] text-neutral-500">{property.developer.about}</p>
                  </div>
                </div>
              </div>
            </Card>

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
                      <div key={expert.email || expert.name} className="rounded-xl border border-neutral-200 p-3">
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
                            <div className="text-sm text-neutral-500">{expert.role}</div>
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
                    <PropertyCard
                      key={item.id}
                      image={item.images[0]}
                      title={item.title}
                      location={item.location}
                      price={item.price}
                      badgeText={item.category}
                      badgeVariant={item.badgeVariant}
                      href={`/properties/${item.slug}`}
                      detailsLabel="View"
                    />
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
                  <div className="mb-4 mt-1 text-neutral-500">{property.priceNote}</div>
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
