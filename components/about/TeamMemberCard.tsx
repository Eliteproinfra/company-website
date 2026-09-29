import Image from "next/image";
import type { TeamMember } from "@/lib/data/teams";

/**
 * Live `.team-card-premium`: #fff, 1px #bbb, 15px radius, 0 10px 30px rgba(0,0,0,.05);
 * hover lifts 10px with a gold border and 0 20px 40px rgba(212,175,55,.15). The social
 * overlay is a black->transparent gradient with white circles that hold gold icons and
 * invert on hover. Name #0a0a0a, position gold uppercase, experience italic #666.
 */
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
    <div className="group overflow-hidden rounded-[15px] border border-team-border bg-white shadow-card-lg transition-all duration-[400ms] hover:-translate-y-2.5 hover:border-primary-gold hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)]">
      <div className="relative h-[250px] overflow-hidden bg-copyright-bg">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(min-width: 992px) 25vw, (min-width: 576px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-gold text-6xl font-medium text-white">
            {name.replace(/^(Mr|Ms|Mrs)\.?\s*/i, "").charAt(0)}
          </div>
        )}
        {contacts.length ? (
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center gap-[15px] bg-linear-to-t from-black/90 to-transparent py-5 opacity-0 transition-all duration-[400ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {contacts.map((contact) => (
              <a
                key={contact.href}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={contact.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[1.1rem] text-primary-gold transition-colors hover:bg-primary-gold hover:text-white"
              >
                <i className={contact.icon} aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="p-[15px] text-center">
        <h3 className="text-[1.3rem] font-bold text-dark-black">{name}</h3>
        <p className="mt-1 block text-[0.85rem] font-semibold uppercase tracking-[1px] text-primary-gold">
          {title}
        </p>
        {experience ? (
          <p className="mt-2 text-[0.9rem] italic text-muted">Experience: {experience}</p>
        ) : null}
      </div>
    </div>
  );
}
