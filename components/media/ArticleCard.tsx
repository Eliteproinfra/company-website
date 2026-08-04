import type { ArticleItem } from "@/lib/types";

export default function ArticleCard({ title, date, excerpt, href }: ArticleItem) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-gold">{date}</p>
      <h3 className="mt-2 text-lg font-bold text-dark-black">{title}</h3>
      <p className="mt-3 flex-1 text-sm text-neutral-500">{excerpt}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary-gold"
      >
        Read More <i className="fas fa-arrow-up-right-from-square text-xs" aria-hidden="true" />
      </a>
    </div>
  );
}
