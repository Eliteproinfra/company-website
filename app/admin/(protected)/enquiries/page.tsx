import Link from "next/link";
import { ENQUIRIES_PER_PAGE, countEnquiries, listEnquiries } from "@/lib/db/queries";
import { deleteEnquiryAction, toggleEnquiryReadAction } from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";

export const metadata = { title: "Enquiries" };

/** JSON `extra` column holds whatever additional fields that form carried. */
function extraPairs(value: unknown): [string, string][] {
  if (!value) return [];
  const parsed =
    typeof value === "string"
      ? (() => {
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        })()
      : value;
  if (!parsed || typeof parsed !== "object") return [];
  return Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [k, String(v)]);
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string; page?: string }>;
}) {
  const params = await searchParams;

  // A typed-in ?page=0, ?page=-1 or ?page=abc all land on page 1 rather than
  // producing a negative OFFSET.
  const requestedPage = Math.trunc(Number(params.page));
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  let rows: Awaited<ReturnType<typeof listEnquiries>> = [];
  let totals = { total: 0, unread: 0 };
  let dbError: string | null = null;
  try {
    // The count and the page itself are independent, so they go out together
    // rather than one after the other.
    [rows, totals] = await Promise.all([
      listEnquiries({ limit: ENQUIRIES_PER_PAGE, offset: (page - 1) * ENQUIRIES_PER_PAGE }),
      countEnquiries(),
    ]);
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  const totalPages = Math.max(1, Math.ceil(totals.total / ENQUIRIES_PER_PAGE));
  const firstOnPage = totals.total === 0 ? 0 : (page - 1) * ENQUIRIES_PER_PAGE + 1;
  const lastOnPage = (page - 1) * ENQUIRIES_PER_PAGE + rows.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-black">Enquiries</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {totals.total} total, {totals.unread} unread
          {rows.length > 0 && totals.total > ENQUIRIES_PER_PAGE
            ? ` — showing ${firstOnPage}–${lastOnPage}`
            : null}
          .
        </p>
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-500">
          {totals.total > 0 ? (
            <>
              Nothing on page {page}.{" "}
              <Link href="/admin/enquiries" className="font-semibold text-primary-gold hover:underline">
                Back to the first page
              </Link>
              .
            </>
          ) : (
            "No enquiries yet. Submissions from the site's contact and service forms appear here."
          )}
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article
              key={row.id}
              className={`rounded-xl border bg-white p-5 ${
                row.is_read ? "border-neutral-200" : "border-primary-gold/40 bg-primary-gold/[0.03]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-dark-black">
                    {row.name || "(no name)"}
                    {row.is_read ? null : (
                      <span className="ml-2 rounded-full bg-primary-gold/15 px-2 py-0.5 text-xs font-semibold text-primary-gold">
                        New
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {row.source || "Website"} · {row.created_at}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={toggleEnquiryReadAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="read" value={row.is_read ? "0" : "1"} />
                    {/* So the redirect lands back on the page being read. */}
                    <input type="hidden" name="page" value={page} />
                    <button
                      type="submit"
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                    >
                      Mark {row.is_read ? "unread" : "read"}
                    </button>
                  </form>
                  <form action={deleteEnquiryAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="page" value={page} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {row.email ? (
                  <div className="flex gap-2">
                    <dt className="font-semibold text-neutral-500">Email</dt>
                    <dd>
                      <a href={`mailto:${row.email}`} className="text-primary-gold hover:underline">
                        {row.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {row.phone ? (
                  <div className="flex gap-2">
                    <dt className="font-semibold text-neutral-500">Phone</dt>
                    <dd>
                      <a href={`tel:${row.phone}`} className="text-primary-gold hover:underline">
                        {row.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {extraPairs(row.extra).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="font-semibold text-neutral-500">{key}</dt>
                    <dd className="text-dark-black">{value}</dd>
                  </div>
                ))}
              </dl>

              {row.message ? (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
                  {row.message}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        // Links, not buttons: this is a Server Component, so paging is a
        // navigation rather than client state. Prev/next only — the inbox is
        // read newest-first and a numbered list of 40 pages helps nobody.
        <nav
          aria-label="Enquiry pages"
          className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4"
        >
          {page > 1 ? (
            <Link
              href={page === 2 ? "/admin/enquiries" : `/admin/enquiries?page=${page - 1}`}
              rel="prev"
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-dark-black hover:bg-neutral-50"
            >
              ← Newer
            </Link>
          ) : (
            // A disabled span rather than a missing element, so "Older" keeps
            // its place on the right instead of jumping to the left on page 1.
            <span className="px-4 py-2 text-sm text-neutral-400">← Newer</span>
          )}

          <span className="text-sm text-neutral-500" aria-current="page">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={`/admin/enquiries?page=${page + 1}`}
              rel="next"
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-dark-black hover:bg-neutral-50"
            >
              Older →
            </Link>
          ) : (
            <span className="px-4 py-2 text-sm text-neutral-400">Older →</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
