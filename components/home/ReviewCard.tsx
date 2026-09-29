import type { Review } from "@/lib/data/reviews";

/** Live `.google-review-card`: #fff, 1px #f0f0f0, 12px radius, 0 5px 20px rgba(0,0,0,.03);
 *  avatar #1a73e8/white, name #333, time #888, stars #fbbc04, text #555. */
export default function ReviewCard({ name, time, quote, verified }: Review) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border-soft bg-white p-[25px] shadow-card-3">
      <div className="flex items-center gap-3">
        <span className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-google-blue text-lg font-bold text-white">
          {name.charAt(0)}
        </span>
        <div>
          <p className="flex items-center gap-1.5 font-bold text-muted-5">
            {name}
            {verified ? (
              <i
                className="fas fa-check-circle text-sm text-google-blue"
                aria-label="Verified reviewer"
              />
            ) : null}
          </p>
          {time ? <p className="text-xs text-muted-4">{time}</p> : null}
        </div>
      </div>
      <div className="mt-4 flex gap-1 text-google-star" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <i key={index} className="fas fa-star text-sm" />
        ))}
      </div>
      <p className="mt-3 flex-1 leading-relaxed text-muted-2">{quote}</p>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-4">
        <i className="fab fa-google" aria-hidden="true" /> Posted on Google
      </p>
    </div>
  );
}
