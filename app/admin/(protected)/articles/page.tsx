import Link from "next/link";
import { listArticles } from "@/lib/db/queries";
import { deleteArticleAction } from "./actions";
import { KINDS, KIND_BASE, KIND_LABEL, normalizeKind } from "./kinds";
import AdminNotice from "@/components/admin/AdminNotice";

export const metadata = { title: "Articles" };

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const kind = normalizeKind(params.kind);

  let rows: Awaited<ReturnType<typeof listArticles>> = [];
  let dbError: string | null = null;
  try {
    rows = await listArticles(kind, { includeUnpublished: true });
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">{KIND_LABEL[kind]}</h1>
          <p className="mt-1 text-sm text-neutral-500">{rows.length} item(s).</p>
        </div>
        <Link
          href={`/admin/articles/new?kind=${kind}`}
          className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827]"
        >
          Add item
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {KINDS.map((option) => (
          <Link
            key={option}
            href={`/admin/articles?kind=${option}`}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              option === kind
                ? "bg-dark-black text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {KIND_LABEL[option]}
          </Link>
        ))}
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Published on</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-neutral-500">
                  Nothing here yet. Run <code className="font-mono">npm run db:seed</code> to import
                  the existing content.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${row.id}`}
                      className="font-semibold text-dark-black hover:text-primary-gold"
                    >
                      {row.title}
                    </Link>
                    <p className="text-xs text-neutral-400">
                      {KIND_BASE[kind]}/{row.slug}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {row.published_on ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.is_published
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {row.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/articles/${row.id}`}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                      >
                        Edit
                      </Link>
                      <form action={deleteArticleAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="kind" value={kind} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
