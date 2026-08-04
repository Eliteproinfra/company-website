import type { Review } from "@/lib/data/reviews";

export default function ReviewCard({ name, quote }: Review) {
  return (
    <div className="h-full rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="flex gap-1 text-primary-gold" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <i key={index} className="fas fa-star" />
        ))}
      </div>
      <p className="mt-4 italic leading-relaxed text-neutral-600">&ldquo;{quote}&rdquo;</p>
      <h4 className="mt-6 font-bold text-dark-black">{name}</h4>
      <p className="text-sm text-neutral-400">Google Review</p>
    </div>
  );
}
