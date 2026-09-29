/**
 * Flash messages driven by query params after a redirect. Server Actions here
 * redirect rather than returning state, so the confirmation has to survive the
 * navigation — a query string is the simplest thing that does.
 */
export default function AdminNotice({
  saved,
  deleted,
  error,
}: {
  saved?: string;
  deleted?: string;
  error?: string | null;
}) {
  if (!saved && !deleted && !error) return null;

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
      >
        {error}
      </p>
    );
  }

  return (
    <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
      {deleted ? "Deleted." : "Saved."}
    </p>
  );
}
