import type { Metadata } from "next";
import ContactInfoCard from "@/components/contact/ContactInfoCard";
import EnquiryForm from "@/components/contact/EnquiryForm";
import MapEmbed from "@/components/contact/MapEmbed";
import OfficeCard from "@/components/contact/OfficeCard";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { offices } from "@/lib/data/offices";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Elite Pro Infraventure for real estate advisory, property management, and NRI investment services.",
};

const contactInfo = [
  { icon: "fas fa-phone", title: "Call Us", value: "+91 9968686868", href: "tel:+919968686868" },
  {
    icon: "fas fa-envelope",
    title: "Email Us",
    value: "info@eliteproinfra.com",
    href: "mailto:info@eliteproinfra.com",
  },
  {
    icon: "fas fa-globe",
    title: "Visit Website",
    value: "www.eliteproinfra.com",
    href: "https://eliteproinfra.com",
  },
  {
    icon: "fas fa-map-marker-alt",
    title: "Head Office",
    value: "3rd Floor, Golf View Corporate Tower A, Golf Course Road, Sector 42, Gurgaon-122002",
  },
];

const delaySequence = [0, 100, 200, 300] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        image="/images/bg/contact-city.jpg"
        title="Contact Us"
        breadcrumbCurrent="Contact Us"
        height="75vh"
        overlay="bg-black/70"
      />

      <section className="relative z-10 bg-white pb-20">
        <div className="container -mt-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item, index) => (
              <Reveal key={item.title} delay={delaySequence[index % delaySequence.length]}>
                <ContactInfoCard {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bs-light py-20">
        <div className="container">
          <SectionHeading
            title="How Can We Help You?"
            description="Select your enquiry type below to get started"
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <Reveal direction="right" className="lg:col-span-7">
              <EnquiryForm />
            </Reveal>
            <Reveal direction="left" className="lg:col-span-5">
              <MapEmbed />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <SectionHeading
            title="Our Presence"
            description="Serving clients across key global locations"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {offices.map((office, index) => (
              <Reveal
                key={office.name}
                delay={[0, 300, 500][index % 3] as 0 | 300 | 500}
              >
                <OfficeCard {...office} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
