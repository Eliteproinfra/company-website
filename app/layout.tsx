import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const siteDescription =
  "Elite Pro Infraventure is a premier real estate consultancy firm dedicated to providing exceptional service and expertise in the property market.";

export const metadata: Metadata = {
  metadataBase: new URL("https://eliteproinfra.com"),
  title: {
    default: "Elite Pro Infraventure | Premium Real Estate in Gurgaon & NCR",
    template: "%s | Elite Pro Infraventure",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Elite Pro Infraventure",
    title: "Elite Pro Infraventure | Premium Real Estate in Gurgaon & NCR",
    description: siteDescription,
    images: [
      {
        url: "/images/hero-founders.png",
        width: 2560,
        height: 1440,
        alt: "Elite Pro Infraventure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Pro Infraventure | Premium Real Estate in Gurgaon & NCR",
    description: siteDescription,
    images: ["/images/hero-founders.png"],
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${playfair.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-white font-sans text-dark-black antialiased">
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
      </body>
    </html>
  );
}
