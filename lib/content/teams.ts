/**
 * What the public "Our Management" pages render — SERVER ONLY.
 *
 * The database when it is configured and has rows for that department, the
 * hardcoded lib/data/teams.ts otherwise. The fallback is not only for a missing
 * .env: `npm run export` builds the static site, possibly on a machine with no
 * MySQL at all, and those builds still have to produce the same pages. A
 * database that is configured but unreachable falls back as well rather than
 * failing the render — a roster is not worth a 500.
 *
 * Because an empty table also falls back, seeding is not a prerequisite for
 * deploying this: run `npm run db:seed` and the same people come back as
 * editable rows.
 */
import "server-only";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listTeamMembers, type TeamDepartment } from "@/lib/db/queries";
import { crmTeam, leasingTeam, salesTeam, type TeamMember } from "@/lib/data/teams";

const STATIC_TEAMS: Record<TeamDepartment, TeamMember[]> = {
  sales: salesTeam,
  leasing: leasingTeam,
  crm: crmTeam,
};

export async function getTeam(department: TeamDepartment): Promise<TeamMember[]> {
  if (!isDatabaseConfigured()) return STATIC_TEAMS[department];

  try {
    const rows = await listTeamMembers(department);
    // No rows means the seed has not been run, not that the department is
    // genuinely empty — keep showing the static roster.
    if (rows.length === 0) return STATIC_TEAMS[department];

    return rows.map((row) => ({
      name: row.name,
      title: row.title,
      experience: row.experience,
      // TeamMemberCard branches on these being absent — it draws a monogram
      // without a photo and hides the contact icons it has no link for — so
      // empty columns have to become undefined, not "".
      photo: row.photo || undefined,
      phone: row.phone || undefined,
      email: row.email || undefined,
      linkedin: row.linkedin || undefined,
    }));
  } catch (error) {
    console.error(`[teams] database unavailable, serving static "${department}" roster:`, error);
    return STATIC_TEAMS[department];
  }
}
