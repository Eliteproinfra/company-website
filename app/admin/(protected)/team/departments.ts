/**
 * Shared team-department constants.
 *
 * Deliberately NOT in actions.ts: a "use server" module may only export async
 * functions, so plain constants and sync helpers have to live in their own file.
 */
import type { TeamDepartment } from "@/lib/db/queries";

export const DEPARTMENTS: TeamDepartment[] = ["sales", "leasing", "crm"];

/** Public page each roster is rendered on — used for revalidation and preview links. */
export const DEPARTMENT_BASE: Record<TeamDepartment, string> = {
  sales: "/about/sales-portfolio-management",
  leasing: "/about/leasing-portfolio-management",
  crm: "/about/crm-marketing",
};

/** The labels from the "Our Management" dropdown on the public site. */
export const DEPARTMENT_LABEL: Record<TeamDepartment, string> = {
  sales: "Sales Portfolio",
  leasing: "Leasing Portfolio",
  crm: "CRM & Marketing",
};

export function normalizeDepartment(value: unknown): TeamDepartment {
  return DEPARTMENTS.includes(value as TeamDepartment)
    ? (value as TeamDepartment)
    : "sales";
}
