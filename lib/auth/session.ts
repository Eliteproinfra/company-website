/**
 * Server-side admin sessions — SERVER ONLY.
 *
 * A 256-bit opaque token sits in an httpOnly cookie; the authoritative record is
 * the `admin_sessions` row. Opaque-token-plus-table rather than a signed JWT
 * specifically so a session can be revoked — which matters here, because the
 * previous host was compromised and "log everyone out now" has to actually work.
 */
import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { execute, queryOne } from "@/lib/db/client";

export const SESSION_COOKIE = "elite_admin_session";
const SESSION_TTL_HOURS = 12;

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  displayName: string;
};

type SessionRow = {
  user_id: number;
  username: string;
  email: string;
  display_name: string;
};

function newToken(): string {
  return randomBytes(32).toString("hex"); // 64 hex chars, matches CHAR(64)
}

/** Creates a session row and sets the cookie. Call only from a Server Action or
 *  Route Handler — `cookies()` is read-only inside a Server Component render. */
export async function createSession(userId: number, userAgent = ""): Promise<void> {
  const token = newToken();
  const expires = new Date(Date.now() + SESSION_TTL_HOURS * 3600 * 1000);

  await execute(
    "INSERT INTO admin_sessions (token, user_id, expires_at, user_agent) VALUES (?, ?, ?, ?)",
    [token, userId, expires, userAgent.slice(0, 255)]
  );
  await execute("UPDATE admin_users SET last_login_at = NOW() WHERE id = ?", [userId]);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Lax still sends the cookie on top-level navigation back into /admin, while
    // blocking it on cross-site POSTs — the CSRF vector that matters here.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

/**
 * Three outcomes, not two.
 *
 * "unavailable" exists because the database is what decides the other two, and
 * it can be down. getCurrentUser() returns null for both "no session" and
 * "could not check", which is correct for an access decision — both must deny —
 * but it is not enough to render a page with: the admin layout awaited it with
 * nothing catching the query error, so with MySQL unreachable every single
 * /admin page answered a bare 500. Not a redirect, not a message: an opaque
 * Next error page, even though the pages beneath it (Enquiries, Properties)
 * each catch their own database errors and display them through AdminNotice.
 * The layout threw before any of that careful handling could run.
 *
 * Collapsing an outage into "signed out" would have been the easier fix and the
 * wrong one — it tells the operator their password is the problem when the
 * database is.
 */
export type SessionState =
  | { status: "authenticated"; user: AdminUser }
  | { status: "anonymous" }
  | { status: "unavailable"; reason: string };

/**
 * Resolves the cookie against the database. Never throws: a failure to verify
 * is reported as "unavailable" rather than raised, so callers can tell an
 * outage apart from a missing session.
 *
 * Fails closed either way — "unavailable" is not a grant.
 */
export async function getSession(): Promise<SessionState> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || token.length !== 64) return { status: "anonymous" };

  let row: SessionRow | null;
  try {
    row = await queryOne<SessionRow>(
      `SELECT s.user_id, u.username, u.email, u.display_name
         FROM admin_sessions s
         JOIN admin_users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expires_at > NOW() AND u.is_active = 1`,
      [token]
    );
  } catch (error) {
    console.error("[auth] could not verify the session against the database:", error);
    return {
      status: "unavailable",
      reason: error instanceof Error ? error.message : "Database error",
    };
  }

  // A cookie that matches no live row is an expired or revoked session, which
  // is genuinely anonymous — unlike the error above.
  if (!row) return { status: "anonymous" };

  return {
    status: "authenticated",
    user: {
      id: row.user_id,
      username: row.username,
      email: row.email,
      displayName: row.display_name || row.username,
    },
  };
}

/**
 * The signed-in user, or null. Validates against the database on every call —
 * the cookie alone proves nothing, since a revoked or expired session must stop
 * working immediately.
 *
 * This is the access-control entry point used by every Server Action and by the
 * upload route: they only need "may this caller proceed?", and an outage is a
 * no. Use {@link getSession} where the difference has to be shown to a human.
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const state = await getSession();
  return state.status === "authenticated" ? state.user : null;
}

/**
 * Signs out: deletes the session row, then clears the cookie.
 *
 * The cookie is cleared even if the DELETE fails, because the alternative is a
 * sign-out button that appears to do nothing. But that failure is not harmless
 * and is no longer silent — the row surviving means the token stays valid until
 * it expires, so anyone still holding it is still signed in. Being able to
 * revoke a session is the entire reason this is an opaque token in a table
 * rather than a JWT, and the previous host was compromised, so "log everyone
 * out now" has to actually work. A `.catch(() => {})` hid exactly the case
 * where it did not.
 */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      const { affectedRows } = await execute("DELETE FROM admin_sessions WHERE token = ?", [token]);
      if (affectedRows === 0) {
        // Already gone — expired, pruned, or revoked elsewhere. Not an error,
        // but worth distinguishing from a successful revocation.
        console.warn("[auth] sign-out matched no session row; it was already gone.");
      }
    } catch (error) {
      console.error(
        "[auth] SIGN-OUT DID NOT REVOKE: the cookie was cleared but the session row survives " +
          "and its token stays valid until it expires. Delete it by hand once the database is " +
          "reachable:\n" +
          "  DELETE FROM admin_sessions WHERE expires_at < NOW();  -- or by token\n",
        error
      );
    }
  }

  store.delete(SESSION_COOKIE);
}

/** Housekeeping: drop expired rows. Called opportunistically on login. */
export async function pruneExpiredSessions(): Promise<void> {
  try {
    await execute("DELETE FROM admin_sessions WHERE expires_at < NOW()");
  } catch (error) {
    // Genuinely non-fatal — this is opportunistic cleanup on a path that has
    // its own database error handling, and failing it must not block a login.
    // Logged rather than swallowed so a table that stops being pruned is
    // visible before it grows into a problem.
    console.warn("[auth] could not prune expired sessions:", error);
  }
}
