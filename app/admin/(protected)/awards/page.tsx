import { listAwards } from "@/lib/db/queries";
import { addAwardAction, deleteAwardAction } from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";
import { ImageField, } from "@/components/admin/ImageField";
import { TextField } from "@/components/admin/FormField";

export const metadata = { title: "Awards" };

export default async function AdminAwardsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;

  let rows: Awaited<ReturnType<typeof listAwards>> = [];
  let dbError: string | null = null;
  try {
    rows = await listAwards({ includeUnpublished: true });
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-black">Awards</h1>
        <p className="mt-1 text-sm text-neutral-500">{rows.length} image(s).</p>
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 font-bold text-dark-black">Add an award</h2>
        <form action={addAwardAction} className="space-y-4">
          <ImageField name="image" label="Image" hint="Upload, or point at an existing /images/awards/... path." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField name="caption" label="Caption" hint="Optional; used as the alt text." />
            <TextField name="sortOrder" label="Sort order" type="number" defaultValue={0} />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827]"
          >
            Add award
          </button>
        </form>
      </section>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-500">
          No awards yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-neutral-200 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={row.image}
                alt={row.caption || ""}
                className="h-28 w-full rounded object-contain"
              />
              <p className="mt-2 truncate text-xs text-neutral-500" title={row.caption || row.image}>
                {row.caption || row.image}
              </p>
              <form action={deleteAwardAction} className="mt-2">
                <input type="hidden" name="id" value={row.id} />
                <button
                  type="submit"
                  className="w-full rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
