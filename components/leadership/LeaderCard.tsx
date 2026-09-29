import Image from "next/image";
import clsx from "clsx";
import type { Leader } from "@/lib/data/leadership";

/**
 * Live `.leader-row` (leadership.php inline styles): #fff, 4px radius, 0 20px 40px
 * rgba(0,0,0,.08); name Playfair #1a1a1a; title #bfa881 uppercase with a 2px #bfa881
 * underline; bio #555.
 */
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
        "group grid grid-cols-1 overflow-hidden rounded-[4px] bg-white shadow-leader-row md:grid-cols-2",
        reverse && "md:[&>*:first-child]:order-2"
      )}
    >
      <div className="relative h-[320px] overflow-hidden md:h-full">
        {/* Cards stack one per row, so the photo is the full `.container` width
            below md and exactly half of it from md up. */}
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 575px) 100vw, (max-width: 767px) 492px, (max-width: 991px) 336px, (max-width: 1199px) 456px, (max-width: 1399px) 546px, 636px"
          className="object-cover object-top transition-transform duration-[600ms] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12">
        <h3 className="font-serif text-3xl font-bold text-light-black lg:text-[2.5rem]">{name}</h3>
        <p className="mt-2 w-fit border-b-2 border-leader-gold pb-[5px] text-sm font-semibold uppercase tracking-[2px] text-leader-gold">
          {leadershipTitle ?? title}
        </p>
        <p className="mt-6 text-[1.05rem] leading-[1.8] text-muted-2">{bio}</p>
      </div>
    </div>
  );
}
