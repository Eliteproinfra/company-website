/**
 * GET /health — liveness/readiness probe for the deployment pipeline and
 * CloudWatch.
 *
 * Contract, relied on by scripts/deploy and the CD workflow:
 *   200  the process is serving AND the database is in an expected state
 *   503  the database is configured but unreachable
 *
 * The distinction matters because the public site does not read from MySQL at
 * all — every page renders from lib/data/*.ts — so an unreachable database
 * does not stop visitors browsing. It does break /admin completely, and after
 * a deploy that almost always means wrong DB_* values rather than a real
 * outage, which is exactly the case a deploy should refuse to go green on.
 * When no DB_* vars are set the check reports "unconfigured" and still returns
 * 200, matching isDatabaseConfigured()'s existing fallback behaviour.
 *
 * Deliberately cheap: SELECT 1, no table access, no auth, no secrets in the
 * body. Safe to hit every 30s from a monitor.
 */
import { NextResponse } from "next/server";
import { isDatabaseConfigured, query } from "@/lib/db/client";

// Never prerendered or cached — a cached health check reports the state of the
// build, not of the running server.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DatabaseStatus = "ok" | "unconfigured" | "error";

async function checkDatabase(): Promise<DatabaseStatus> {
  if (!isDatabaseConfigured()) return "unconfigured";
  try {
    await query("SELECT 1");
    return "ok";
  } catch {
    // The reason is deliberately not returned to the caller — it would expose
    // the host, port and user from the connection string. It is logged instead.
    return "error";
  }
}

export async function GET() {
  const database = await checkDatabase();

  if (database === "error") {
    console.error("Health check failed: database is configured but unreachable.");
  }

  const healthy = database !== "error";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks: { database },
      // Set by the deploy script so CD can assert the commit it just shipped is
      // the one actually serving, rather than trusting that the restart worked.
      commit: process.env.APP_COMMIT ?? "unknown",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        // Must never be cached by nginx, a CDN, or a browser.
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
