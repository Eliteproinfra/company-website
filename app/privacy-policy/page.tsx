import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Elite Pro Infraventure collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero image="/images/banner-1.jpg" title="Privacy Policy" breadcrumbCurrent="Privacy Policy" height="60vh" />

      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-neutral-600">
            <p>
              This Privacy Policy explains how Elite Pro Infraventure collects, uses, and protects
              information when you use our website and services.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Information We Collect</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Contact details you submit (name, phone, email) via forms or inquiries.</li>
              <li>Property preferences and requirements shared with us.</li>
              <li>
                Basic technical data like browser type, device information, and approximate
                location (via analytics).
              </li>
            </ul>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">How We Use Information</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>To respond to inquiries and provide real estate advisory services.</li>
              <li>To share relevant updates about properties, services, and offers (where permitted).</li>
              <li>To improve website performance and user experience.</li>
            </ul>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Sharing of Information</h2>
            <p className="mt-4">
              We do not sell personal information. We may share details with trusted partners and
              service providers when necessary to deliver services, comply with legal
              obligations, or protect our rights.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Cookies</h2>
            <p className="mt-4">
              We may use cookies to enhance site functionality and understand website usage. You
              can control cookies through your browser settings.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Data Security</h2>
            <p className="mt-4">
              We take reasonable measures to protect your information. However, no online
              transmission is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-dark-black">Contact Us</h2>
            <p className="mt-4">
              For privacy-related questions, please reach out via our{" "}
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
