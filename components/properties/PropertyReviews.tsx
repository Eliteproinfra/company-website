import type { PropertyReview } from "@/lib/data/propertyDetails";

/** A rating the admin typed, clamped to the 1–5 the stars can show. Anything
 *  outside that range (or not a number at all) is left out of the average
 *  rather than dragging it to zero. */
function parseRating(value: string): number | null {
  const rating = Number(value);
  return Number.isFinite(rating) && rating >= 1 && rating <= 5 ? rating : null;
}

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-primary-gold ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={
            rating >= star
              ? "fas fa-star"
              : rating >= star - 0.5
                ? "fas fa-star-half-alt"
                : "far fa-star"
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function PropertyReviews({ reviews }: { reviews: PropertyReview[] }) {
  const rated = reviews
    .map((review) => parseRating(review.rating))
    .filter((rating): rating is number => rating !== null);

  const average = rated.length
    ? Math.round((rated.reduce((sum, rating) => sum + rating, 0) / rated.length) * 10) / 10
    : null;

  const good = reviews.map((review) => review.good?.trim()).filter(Boolean);
  const bad = reviews.map((review) => review.bad?.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      {average !== null ? (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-black/[0.06] bg-neutral-50 p-4">
          <div>
            <div className="text-3xl font-extrabold text-dark-black">{average.toFixed(1)}</div>
            <Stars rating={average} />
          </div>
          <div className="text-sm text-muted">
            {rated.length} {rated.length === 1 ? "rating" : "ratings"}
          </div>
        </div>
      ) : null}

      {good.length || bad.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {good.length ? (
            <div className="rounded-xl border border-black/[0.06] p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-dark-black">
                <i className="fas fa-thumbs-up text-green-600" aria-hidden="true" />
                What&rsquo;s good
              </h3>
              <ul className="space-y-1.5 text-sm text-muted">
                {good.map((point, index) => (
                  <li key={`${point}-${index}`}>{point}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {bad.length ? (
            <div className="rounded-xl border border-black/[0.06] p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-dark-black">
                <i className="fas fa-thumbs-down text-red-600" aria-hidden="true" />
                What&rsquo;s bad
              </h3>
              <ul className="space-y-1.5 text-sm text-muted">
                {bad.map((point, index) => (
                  <li key={`${point}-${index}`}>{point}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <ul className="space-y-3">
        {reviews.map((review, index) => {
          const rating = parseRating(review.rating);
          return (
            <li key={`${review.name}-${index}`} className="rounded-xl border border-black/[0.06] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-bold text-dark-black">
                    {review.name.trim().charAt(0) || "?"}
                  </span>
                  <div>
                    <div className="font-bold text-dark-black">{review.name}</div>
                    {review.date ? <div className="text-xs text-muted">{review.date}</div> : null}
                  </div>
                </div>
                {rating !== null ? <Stars rating={rating} /> : null}
              </div>
              {review.text ? (
                <p className="mt-3 leading-[1.8] text-muted">{review.text}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
