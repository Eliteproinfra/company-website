import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const siteDescription =
  "Elite Pro Infraventure is a premier real estate consultancy firm dedicated to providing exceptional service and expertise in the property market.";

/**
 * The public site's chrome. It lives here rather than in the root layout so the
 * admin panel — which sits outside this route group — renders without the
 * marketing navbar, footer and business structured data.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Elite Pro Infraventure",
  alternateName: "Elite Pro Infra",
  url: "https://eliteproinfra.com",
  logo: "https://eliteproinfra.com/images/Elite-pro-logo.png",
  image: "https://eliteproinfra.com/images/hero-founders.png",
  description: siteDescription,
  telephone: "+91-9968686868",
  email: "info@eliteproinfra.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3rd Floor, Golf View Corporate Tower A, Golf Course Road, Sector 42",
    addressLocality: "Gurgaon",
    addressRegion: "Haryana",
    postalCode: "122002",
    addressCountry: "IN",
  },
  areaServed: ["Gurgaon", "Delhi NCR", "Noida", "Manesar"],
  sameAs: [
    "https://www.facebook.com/eliteproinfra",
    "https://www.instagram.com/eliteproinfra",
    "https://www.linkedin.com/company/eliteproinfra/",
    "https://www.youtube.com/@eliteproinfra984",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "119",
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-dark-black"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
