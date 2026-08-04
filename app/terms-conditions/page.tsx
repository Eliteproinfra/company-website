import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions governing use of the Elite Pro Infraventure website and services.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <PageHero
        image="/images/banner-1.jpg"
        title="Terms & Conditions"
        breadcrumbCurrent="Terms & Conditions"
        height="60vh"
      />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-neutral-600">
            <p>
              These Terms &amp; Conditions govern your use of the Elite Pro Infraventure website
              and services. By using this website, you agree to these terms.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Use of Website</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>You agree to use the website for lawful purposes only.</li>
              <li>You must not attempt to disrupt or compromise website security.</li>
              <li>Content is provided for informational purposes and may change without notice.</li>
            </ul>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Property Information</h2>
            <p className="mt-4">
              Project details, pricing, availability, and specifications displayed on the website
              may be subject to change by developers or third parties. Please verify details with
              our team before making decisions.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Intellectual Property</h2>
            <p className="mt-4">
              All website content, branding, and assets are owned by Elite Pro Infraventure or
              used with permission. Users cannot copy, reproduce, or redistribute content without
              written consent.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Limitation of Liability</h2>
            <p className="mt-4">
              We disclaim responsibility for damages arising from website use, including reliance
              on presented information, service interruptions, or technical errors.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Third-Party Links</h2>
            <p className="mt-4">
              The website may contain links to external sites. Elite Pro Infraventure assumes no
              responsibility for their content or privacy policies.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Contact</h2>
            <p className="mt-4">
              For questions regarding these terms, please reach out via our{" "}
              <a href="/contact" className="font-semibold text-primary-gold">
                Contact page
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
