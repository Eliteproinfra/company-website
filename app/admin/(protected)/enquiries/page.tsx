import { listEnquiries } from "@/lib/db/queries";
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
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  const params = await searchParams;

  let rows: Awaited<ReturnType<typeof listEnquiries>> = [];
  let dbError: string | null = null;
  try {
    rows = await listEnquiries(200);
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  const unread = rows.filter((row) => !row.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-black">Enquiries</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {rows.length} total, {unread} unread.
        </p>
      </div>

      <AdminNotice deleted={params.deleted} error={params.error ?? dbError} />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-500">
          No enquiries yet. Submissions from the site&apos;s contact and service forms appear here.
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
                    <button
                      type="submit"
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                    >
                      Mark {row.is_read ? "unread" : "read"}
                    </button>
                  </form>
                  <form action={deleteEnquiryAction}>
                    <input type="hidden" name="id" value={row.id} />
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
    </div>
  );
}
