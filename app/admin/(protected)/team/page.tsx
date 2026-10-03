import Link from "next/link";
import { listTeamMembers } from "@/lib/db/queries";
import { deleteTeamMemberAction } from "./actions";
import { DEPARTMENTS, DEPARTMENT_BASE, DEPARTMENT_LABEL, normalizeDepartment } from "./departments";
import AdminNotice from "@/components/admin/AdminNotice";

export const metadata = { title: "Our Management" };

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{
    department?: string;
    saved?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const department = normalizeDepartment(params.department);

  let rows: Awaited<ReturnType<typeof listTeamMembers>> = [];
  let dbError: string | null = null;
  try {
    rows = await listTeamMembers(department, { includeUnpublished: true });
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">{DEPARTMENT_LABEL[department]}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {rows.length} member(s) on{" "}
            <Link
              href={DEPARTMENT_BASE[department]}
              className="font-semibold text-primary-gold hover:underline"
            >
              {DEPARTMENT_BASE[department]}
            </Link>
          </p>
        </div>
        <Link
          href={`/admin/team/new?department=${department}`}
          className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827]"
        >
          Add member
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((option) => (
          <Link
            key={option}
            href={`/admin/team?department=${option}`}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              option === department
                ? "bg-dark-black text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {DEPARTMENT_LABEL[option]}
          </Link>
        ))}
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Member</th>
              <th className="px-4 py-3 font-semibold">Experience</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  Nobody here yet. Run <code className="font-mono">npm run db:seed</code> to import
                  the people the page currently shows — until there is at least one row, the public
                  page keeps rendering the hardcoded list.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.photo}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover object-top"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-gold text-sm font-semibold text-white">
                          {row.name.replace(/^(Mr|Ms|Mrs)\.?\s*/i, "").charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/admin/team/${row.id}?department=${department}`}
                          className="font-semibold text-dark-black hover:text-primary-gold"
                        >
                          {row.name}
                        </Link>
                        <p className="truncate text-xs text-neutral-400">{row.title || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {row.experience || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{row.email || row.phone || "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{row.sort_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.is_published
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {row.is_published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/team/${row.id}?department=${department}`}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                      >
                        Edit
                      </Link>
                      <form action={deleteTeamMemberAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="department" value={department} />
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
