import type { Review } from "@/lib/data/reviews";

export default function ReviewCard({ name, time, quote, verified }: Review) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-gold/15 text-lg font-bold text-primary-gold">
          {name.charAt(0)}
        </span>
        <div>
          <p className="flex items-center gap-1.5 font-bold text-dark-black">
            {name}
            {verified ? (
              <i
                className="fas fa-check-circle text-sm text-[#1a73e8]"
                aria-label="Verified reviewer"
              />
            ) : null}
          </p>
          {time ? <p className="text-xs text-neutral-400">{time}</p> : null}
        </div>
      </div>
      <div className="mt-4 flex gap-1 text-primary-gold" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <i key={index} className="fas fa-star text-sm" />
        ))}
      </div>
      <p className="mt-3 flex-1 leading-relaxed text-neutral-600">{quote}</p>
      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
        <i className="fab fa-google" aria-hidden="true" /> Posted on Google
      </p>
    </div>
  );
}
