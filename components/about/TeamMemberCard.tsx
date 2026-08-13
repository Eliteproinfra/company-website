import Image from "next/image";
import type { TeamMember } from "@/lib/data/teams";

export default function TeamMemberCard({
  name,
  title,
  experience,
  photo,
  phone,
  email,
  linkedin,
}: TeamMember) {
  const contacts = [
    phone ? { href: `tel:${phone}`, icon: "fas fa-phone", label: `Call ${name}` } : null,
    email ? { href: `mailto:${email}`, icon: "fas fa-envelope", label: `Email ${name}` } : null,
    linkedin ? { href: linkedin, icon: "fab fa-linkedin-in", label: `${name} on LinkedIn` } : null,
  ].filter((c) => c !== null);

  return (
    <div className="group overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold hover:shadow-lg">
      <div className="relative h-[240px] overflow-hidden bg-neutral-100">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(min-width: 992px) 25vw, (min-width: 576px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-gold/10 text-4xl font-bold text-primary-gold">
            {name.replace(/^(Mr|Ms|Mrs)\.?\s*/i, "").charAt(0)}
          </div>
        )}
        {contacts.length ? (
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0">
            {contacts.map((contact) => (
              <a
                key={contact.href}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={contact.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-dark-black transition-colors hover:bg-primary-gold"
              >
                <i className={`${contact.icon} text-sm`} aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-bold text-dark-black">{name}</h3>
        <p className="mt-1 text-xs font-semibold text-primary-gold">{title}</p>
        {experience ? (
          <p className="mt-1 text-xs text-neutral-400">Experience: {experience}</p>
        ) : null}
      </div>
    </div>
  );
}
