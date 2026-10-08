import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

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
  verification: {
    google: "UEGiyx1tWHuthWmRENqazlVjMCm1YPuBnxGVCWHMyRY",
  },
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

/**
 * Document shell only. The marketing navbar and footer belong to the (site)
 * route group so that /admin can render a bare, chrome-free panel.
 */
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
        {children}
      </body>
    </html>
  );
}
