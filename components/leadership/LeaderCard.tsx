import Image from "next/image";
import clsx from "clsx";
import type { Leader } from "@/lib/data/leadership";

export default function LeaderCard({
  photo,
  name,
  title,
  leadershipTitle,
  bio,
  reverse = false,
}: Leader & { reverse?: boolean }) {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:grid-cols-2",
        reverse && "md:[&>*:first-child]:order-2"
      )}
    >
      <div className="relative h-[320px] md:h-full">
        <Image src={photo} alt={name} fill className="object-cover" />
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12">
        <h3 className="text-3xl font-bold text-dark-black">{name}</h3>
        <p className="mt-2 text-sm font-bold uppercase tracking-[1.5px] text-primary-gold">
          {leadershipTitle ?? title}
        </p>
        <div className="mt-2 h-[3px] w-16 bg-primary-gold" />
        <p className="mt-5 leading-relaxed text-neutral-500">{bio}</p>
      </div>
    </div>
  );
}
