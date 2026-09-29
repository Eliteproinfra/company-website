import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { ArticleItem } from "@/lib/types";

/** Live pr-media/insight-blog/news-update cards: Bootstrap `.card.border-0.shadow-sm.hover-lift`
 *  (white, no border, 0 .125rem .25rem rgba(0,0,0,.075); hover lifts 5px with 0 10px 20px
 *  rgba(0,0,0,.1)); date `.text-muted.small`; title bold #0a0a0a. */
export default function ArticleCard({ title, date, excerpt, href, image }: ArticleItem) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md bg-white shadow-bs-sm transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
      <Link href={href} className="relative block h-[250px] w-full overflow-hidden" tabIndex={-1}>
        <Image src={image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-bs-muted">
          <i className="far fa-calendar-alt mr-2" aria-hidden="true" />
          {date}
        </p>
        <h3 className="mt-2 text-lg font-bold text-dark-black">
          <Link href={href} className="transition-colors hover:text-primary-gold">
            {title}
          </Link>
        </h3>
        {/* Live trims the card excerpt to 100 characters and appends "...". */}
        <p className="mt-3 flex-1 text-sm text-bs-muted">
          {excerpt.length > 100 ? `${excerpt.slice(0, 100)}...` : excerpt}
        </p>
        {/* Live: `.btn.btn-outline-gold.rounded-pill.w-100` */}
        <Button
          href={href}
          variant="outline"
          size="sm"
          iconRight="fas fa-arrow-right"
          className="mt-5 w-full rounded-full"
        >
          Read More
        </Button>
      </div>
    </div>
  );
}
