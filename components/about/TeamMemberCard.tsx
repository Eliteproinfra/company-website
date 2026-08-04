import Image from "next/image";
import type { TeamMember } from "@/lib/data/teams";

export default function TeamMemberCard({ name, title, experience, photo }: TeamMember) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-5 text-center shadow-sm transition-colors hover:border-primary-gold">
      {photo ? (
        <div className="mx-auto h-20 w-20 overflow-hidden rounded-full">
          <Image src={photo} alt={name} width={80} height={80} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-gold/10 text-primary-gold">
          <i className="fas fa-user" aria-hidden="true" />
        </div>
      )}
      <h3 className="mt-3 text-sm font-bold text-dark-black">{name}</h3>
      <p className="mt-1 text-xs text-primary-gold">{title}</p>
      <p className="mt-1 text-xs text-neutral-400">{experience} experience</p>
    </div>
  );
}
