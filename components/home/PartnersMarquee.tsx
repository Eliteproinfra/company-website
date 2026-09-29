import Image from "next/image";
import type { Partner } from "@/lib/data/partners";

/** Live `.developer-card`: #fff, 1px #eee, 12px radius, 0 5px 15px rgba(0,0,0,.05), logo at 70%;
 *  hover lifts 5px, gold border, 0 10px 25px rgba(212,175,55,.15), logo 100%. */
function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="group/card flex h-32 w-52 shrink-0 items-center justify-center rounded-xl border border-border-card bg-white p-[15px] shadow-card-15 transition-all duration-300 hover:-translate-y-[5px] hover:border-primary-gold hover:shadow-developer-hover sm:h-36 sm:w-64">
      <Image
        src={partner.image}
        alt={partner.name}
        width={280}
        height={140}
        sizes="(min-width: 576px) 256px, 208px"
        className="h-auto max-h-24 w-auto max-w-full object-contain opacity-70 transition-opacity duration-300 group-hover/card:opacity-100 sm:max-h-28"
      />
    </div>
  );
}

export default function PartnersMarquee({ partners }: { partners: Partner[] }) {
  /* The track holds two identical groups and slides by exactly -50%, so the gap
     has to live inside each group (gap-6 between cards, pr-6 after the last one)
     rather than on the track - otherwise half the track is one gap short of a
     full group and the loop jumps on every repeat. */
  const group = (clone: boolean) => (
    <div className="flex shrink-0 gap-6 pr-6" aria-hidden={clone || undefined}>
      {partners.map((partner) => (
        <PartnerCard key={clone ? `${partner.name}-clone` : partner.name} partner={partner} />
      ))}
    </div>
  );

  return (
    <div className="marquee-fade group relative overflow-hidden py-2">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
