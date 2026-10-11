import { listAwards } from "@/lib/db/queries";
import {
  addAwardAction,
  deleteAwardAction,
  moveAwardAction,
  updateAwardAction,
} from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";
import { ImageField } from "@/components/admin/ImageField";
import { adminInputClass, TextField } from "@/components/admin/FormField";

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

  const hidden = rows.filter((row) => !row.is_published).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-black">Awards</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {rows.length} image(s)
          {hidden ? `, ${hidden} hidden from the public page` : ""}. The number on each card is
          the position it appears in on /awards and in the homepage carousel.
        </p>
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-bold text-dark-black">Add an award</h2>
        <p className="mb-4 mt-1 text-xs text-neutral-500">
          A photo of the trophy or certificate. One entry per image.
        </p>
        <form action={addAwardAction} className="space-y-4">
          <ImageField
            name="image"
            label="Image"
            hint="Upload a file, or type a path to an existing /images/awards/... image. Shown fitted whole, so nothing gets cropped off."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="caption"
              label="Caption"
              placeholder="Best Real Estate Consultant 2024"
              hint="Not printed on the page — it is the description read out by screen readers and shown if the image fails to load. Optional, but worth filling in."
            />
            <TextField
              name="sortOrder"
              label="Sort order"
              type="number"
              hint="Leave blank to add it to the end — then use the ↑ ↓ arrows on the card to move it. Lowest number shows first."
            />
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => {
            // The position shown is this row's place in the gallery, counted
            // here rather than read from sort_order: several rows commonly
            // share a sort_order (everything added through the form above
            // defaults to 0) and the order they actually appear in comes from
            // the id tiebreak in listAwards. Printing sort_order would show
            // five cards all claiming to be number 0.
            const position = index + 1;
            const isFirst = index === 0;
            const isLast = index === rows.length - 1;

            return (
              <div key={row.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-dark-black px-2.5 py-1 text-xs font-bold text-white">
                    #{position}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {row.is_published ? null : (
                      <span className="rounded border border-neutral-300 px-2 py-0.5 text-[0.7rem] font-semibold uppercase text-neutral-500">
                        Hidden
                      </span>
                    )}
                    {/* Separate one-button forms: a nested form is invalid HTML,
                        and these must not carry the edit fields below. */}
                    <form action={moveAwardAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={isFirst}
                        aria-label={`Move to position ${position - 1}`}
                        className="rounded border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50 disabled:opacity-30"
                      >
                        <i className="fas fa-arrow-up" aria-hidden="true" />
                      </button>
                    </form>
                    <form action={moveAwardAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={isLast}
                        aria-label={`Move to position ${position + 1}`}
                        className="rounded border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50 disabled:opacity-30"
                      >
                        <i className="fas fa-arrow-down" aria-hidden="true" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={row.image}
                  alt={row.caption || ""}
                  className="h-32 w-full rounded bg-neutral-50 object-contain"
                />

                <form action={updateAwardAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={row.id} />

                  <ImageField
                    name="image"
                    id={`award-${row.id}-image`}
                    label="Image path"
                    defaultValue={row.image}
                    compact
                  />

                  <div>
                    <label
                      htmlFor={`award-${row.id}-caption`}
                      className="mb-1 block text-xs font-semibold text-neutral-500"
                    >
                      Caption
                    </label>
                    <input
                      id={`award-${row.id}-caption`}
                      name="caption"
                      type="text"
                      defaultValue={row.caption}
                      placeholder="Best Real Estate Consultant 2024"
                      className={adminInputClass}
                    />
                  </div>

                  <div className="flex flex-wrap items-end gap-4">
                    <div className="w-28">
                      <label
                        htmlFor={`award-${row.id}-sort`}
                        className="mb-1 block text-xs font-semibold text-neutral-500"
                      >
                        Sort order
                      </label>
                      <input
                        id={`award-${row.id}-sort`}
                        name="sortOrder"
                        type="number"
                        defaultValue={row.sort_order}
                        className={adminInputClass}
                      />
                    </div>
                    <label className="flex items-center gap-2 pb-2.5 text-xs font-semibold text-dark-black">
                      <input
                        type="checkbox"
                        name="isPublished"
                        defaultChecked={Boolean(row.is_published)}
                        className="h-4 w-4 accent-[#d4af37]"
                      />
                      Published
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-dark-black hover:bg-neutral-50"
                  >
                    Save changes
                  </button>
                </form>

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
            );
          })}
        </div>
      )}
    </div>
  );
}
