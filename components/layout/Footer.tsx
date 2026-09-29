import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/lib/data/social";
import FooterCopyright from "./FooterCopyright";
import NewsletterForm from "./NewsletterForm";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Investment Advisory", href: "/services/investment-sales-advisory" },
  { label: "NRI Services", href: "/services/nri-advisory" },
  { label: "Property Management", href: "/services/property-management" },
  { label: "Land & Acquisition", href: "/services/land-acquisition" },
];

const seoLinkColumns = [
  {
    title: "Property in India",
    links: [
      { label: "Property in Gurgaon", href: "/properties?city=Gurgaon" },
      { label: "Property in Manesar", href: "/properties?city=Manesar" },
      { label: "Property in Delhi", href: "/properties?city=Delhi" },
      { label: "Property in Noida", href: "/properties?city=Noida" },
    ],
  },
  {
    title: "Residential Properties",
    links: [
      { label: "Birla Pravaah", href: "/properties" },
      { label: "Emaar Serenity Hills", href: "/properties" },
      { label: "Tulip Monsella", href: "/properties" },
      { label: "Godrej Sora", href: "/properties" },
    ],
  },
  {
    title: "Commercial Properties",
    links: [
      { label: "AIPL Joy Central", href: "/properties" },
      { label: "Conscient SOHO", href: "/properties" },
      { label: "Reach Airia Corporate Tower", href: "/properties" },
      { label: "Emaar India Business Centre", href: "/properties" },
    ],
  },
  {
    title: "SCO Plots",
    links: [
      { label: "Emaar EBD 65", href: "/properties" },
      { label: "Emaar EBD 65 NXT", href: "/properties" },
      { label: "M3M SCO 113 Market", href: "/properties" },
      { label: "Emaar EBD 89", href: "/properties" },
    ],
  },
];

const contactItems = [
  {
    icon: "fas fa-map-marker-alt",
    href: "https://maps.app.goo.gl/Urz5goXdpGSANVGi6",
    label: "3rd Floor, Golf View Corporate Tower A, Golf Course Road, Sector 42, Gurgaon 122002",
  },
  { icon: "fas fa-phone", href: "tel:+919968686868", label: "+91 9968686868" },
  { icon: "fas fa-envelope", href: "mailto:info@eliteproinfra.com", label: "info@eliteproinfra.com" },
  { icon: "fas fa-globe", href: "https://www.eliteproinfra.com", label: "www.eliteproinfra.com" },
];

const headingClasses = "mb-6 text-[0.85rem] font-bold uppercase tracking-[2px] text-white";

/**
 * Live footer = two blocks:
 * 1. `section.py-5.bg-dark.border-bottom.border-secondary.border-opacity-10` (#212529) with
 *    gold `.text-gold` column headings and `.text-secondary` (#6c757d) links that turn gold.
 * 2. `footer` with `linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)`, a 2px
 *    transparent->gold->transparent top line, the colour logo at 90% opacity, white
 *    headings/links, `.btn-outline-light.border-secondary` social circles that turn gold on
 *    hover, and the copyright bar (see FooterCopyright).
 */
export default function Footer() {
  return (
    <>
      <section className="border-b border-bs-secondary/10 bg-bs-dark py-12">
        <div className="container grid grid-cols-2 gap-8 sm:grid-cols-4">
          {seoLinkColumns.map((column) => (
            <div key={column.title}>
              <h6 className="mb-6 text-[0.85rem] font-bold uppercase tracking-[2px] text-primary-gold">
                {column.title}
              </h6>
              <ul className="space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-1 text-bs-secondary transition-colors hover:text-primary-gold"
                    >
                      <i
                        className="fas fa-angle-right mr-2 text-xs text-primary-gold opacity-50"
                        aria-hidden="true"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative overflow-hidden bg-dark-gradient pt-12 text-white">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-line" aria-hidden="true" />

        <div className="container relative z-[1] py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
            <div className="md:col-span-2 lg:col-span-4">
              <Image
                src="/images/Elite-pro-logo.png"
                alt="Elite Pro Infraventure"
                width={845}
                height={249}
                className="mb-6 h-[70px] w-auto rounded-lg p-2 opacity-90"
              />
              <p className="text-[0.95rem] leading-[1.8] text-white">
                Elite Pro Infraventure is one of India&apos;s leading real estate advisory firms,
                guiding investors, homebuyers, and businesses toward secure, profitable
                opportunities since 2012.
              </p>
              <div className="mt-6 flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-bs-secondary text-white transition-all duration-300 hover:bg-bs-light hover:text-primary-gold"
                  >
                    <i className={social.icon} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h5 className={headingClasses}>Quick Links</h5>
              <ul className="space-y-3 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h5 className={headingClasses}>Our Services</h5>
              <ul className="space-y-3 text-sm">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h5 className={headingClasses}>Get in Touch</h5>
              <ul className="space-y-4 text-[0.9rem]">
                {contactItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-start gap-3 text-white"
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <i className={`${item.icon} mt-1 text-primary-gold`} aria-hidden="true" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <FooterCopyright />
      </footer>
    </>
  );
}
