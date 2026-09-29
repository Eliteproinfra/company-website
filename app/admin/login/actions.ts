"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { queryOne } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, pruneExpiredSessions } from "@/lib/auth/session";

export type LoginState = { error: string | null };

/**
 * A pre-computed hash of a value nobody will guess. When the username does not
 * exist we still run a full scrypt verification against this, so a bad username
 * and a bad password take the same time — otherwise the response latency tells
 * an attacker which usernames are real.
 */
const DUMMY_HASH =
  "scrypt$32768$8$1$YWJjZGVmZ2hpamtsbW5vcA==$" +
  "ZHVtbXlkdW1teWR1bW15ZHVtbXlkdW1teWR1bW15ZHVtbXlkdW1teWR1bW15ZHVtbXlkdW1teWQ=";

/** Only same-origin paths — never an absolute URL, which would be an open redirect. */
function safeNext(value: FormDataEntryValue | null): string {
  const raw = typeof value === "string" ? value : "";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  if (!raw.startsWith("/admin")) return "/admin";
  return raw;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!username || !password) {
    return { error: "Enter both username and password." };
  }

  let user: { id: number; password_hash: string } | null = null;
  try {
    user = await queryOne<{ id: number; password_hash: string }>(
      "SELECT id, password_hash FROM admin_users WHERE username = ? AND is_active = 1",
      [username]
    );
  } catch {
    return { error: "Database unavailable. Check the DB_* settings in .env.local." };
  }

  const ok = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);

  // Identical message either way: never reveal whether the username exists.
  if (!user || !ok) {
    return { error: "Invalid username or password." };
  }

  const headerList = await headers();
  await pruneExpiredSessions();
  await createSession(user.id, headerList.get("user-agent") ?? "");

  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
