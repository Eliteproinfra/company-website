/**
 * Server-side admin sessions — SERVER ONLY.
 *
 * A 256-bit opaque token sits in an httpOnly cookie; the authoritative record is
 * the `admin_sessions` row. Opaque-token-plus-table rather than a signed JWT
 * specifically so a session can be revoked — which matters here, because the
 * previous host was compromised and "log everyone out now" has to actually work.
 */
import "server-only";
import { randomBytes, timingSafeEqual } from "node:crypto";
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
 * The signed-in user, or null. Validates against the database on every call —
 * the cookie alone proves nothing, since a revoked or expired session must stop
 * working immediately.
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || token.length !== 64) return null;

  const row = await queryOne<SessionRow>(
    `SELECT s.user_id, u.username, u.email, u.display_name
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > NOW() AND u.is_active = 1`,
    [token]
  );
  if (!row) return null;

  return {
    id: row.user_id,
    username: row.username,
    email: row.email,
    displayName: row.display_name || row.username,
  };
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await execute("DELETE FROM admin_sessions WHERE token = ?", [token]).catch(() => {});
  }
  store.delete(SESSION_COOKIE);
}

/** Housekeeping: drop expired rows. Called opportunistically on login. */
export async function pruneExpiredSessions(): Promise<void> {
  await execute("DELETE FROM admin_sessions WHERE expires_at < NOW()").catch(() => {});
}

/**
 * Compares two secrets without leaking length/content through timing. Used for
 * the login flow's dummy comparison so a missing username and a wrong password
 * take the same time.
 */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
