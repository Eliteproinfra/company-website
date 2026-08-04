import Image from "next/image";
import Link from "next/link";
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

const socialLinks = [
  { icon: "fab fa-facebook-f", label: "Facebook", href: "https://www.facebook.com/eliteproinfra" },
  {
    icon: "fab fa-instagram",
    label: "Instagram",
    href: "https://www.instagram.com/eliteproinfra?igsh=emwzMnpiZW8zejN4",
  },
  {
    icon: "fab fa-linkedin-in",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/eliteproinfra/",
  },
  { icon: "fab fa-youtube", label: "YouTube", href: "https://www.youtube.com/@eliteproinfra984" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-black pb-8 pt-20 text-white/60">
      <div className="border-y border-primary-gold/20 bg-white/[0.03] py-14">
        <div className="container grid grid-cols-2 gap-8 sm:grid-cols-4">
          {seoLinkColumns.map((column) => (
            <div key={column.title}>
              <h6 className="mb-4 text-xs font-bold uppercase tracking-[1.5px] text-primary-gold">
                {column.title}
              </h6>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-primary-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-4">
            <Image
              src="/images/Elite-pro-logo.png"
              alt="Elite Pro Infraventure"
              width={160}
              height={48}
              className="mb-5 h-12 w-auto [filter:brightness(0)_invert(1)]"
            />
            <p className="text-sm leading-relaxed">
              Elite Pro Infraventure is one of India&apos;s leading real estate advisory firms,
              guiding investors, homebuyers, and businesses toward secure, profitable
              opportunities since 2012.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-primary-gold hover:bg-primary-gold"
                >
                  <i className={social.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h5 className="mb-6 text-lg font-semibold text-white">Quick Links</h5>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="mb-6 text-lg font-semibold text-white">Our Services</h5>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h5 className="mb-6 text-lg font-semibold text-white">Get in Touch</h5>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt mt-1 text-primary-gold" aria-hidden="true" />
                <span>3rd Floor, Golf View Corporate Tower &apos;A&apos;, Sector 42, Gurgaon</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-phone-alt mt-1 text-primary-gold" aria-hidden="true" />
                <a href="tel:+919968686868" className="transition-colors hover:text-primary-gold">
                  +91 9968686868
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope mt-1 text-primary-gold" aria-hidden="true" />
                <a
                  href="mailto:info@eliteproinfra.com"
                  className="transition-colors hover:text-primary-gold"
                >
                  info@eliteproinfra.com
                </a>
              </li>
            </ul>
            <NewsletterForm />
            <p className="mt-2 text-xs italic text-white/40">Subscribe for exclusive updates.</p>
          </div>
        </div>

        <hr className="my-12 border-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm md:flex-row md:text-left">
          <p>&copy; {new Date().getFullYear()} Elite Pro Infraventure. All rights reserved.</p>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/privacy-policy" className="transition-colors hover:text-primary-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-conditions"
                className="transition-colors hover:text-primary-gold"
              >
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="transition-colors hover:text-primary-gold">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
