import Image from "next/image";
import Link from "next/link";
import type { ArticleItem } from "@/lib/types";

export default function ArticleCard({ title, date, excerpt, href, image }: ArticleItem) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="relative block h-[250px] w-full overflow-hidden" tabIndex={-1}>
        <Image src={image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-gold">{date}</p>
        <h3 className="mt-2 text-lg font-bold text-dark-black">
          <Link href={href} className="transition-colors hover:text-primary-gold">
            {title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm text-neutral-500">{excerpt}</p>
        <Link
          href={href}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary-gold"
        >
          Read More <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
