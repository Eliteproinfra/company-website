#!/usr/bin/env node
/**
 * Resets an admin password to a freshly generated one, and revokes that user's
 * existing sessions so anyone already signed in as them is kicked out.
 *
 * Usage:
 *   npm run db:passwd -- --user admin
 *   npm run db:passwd -- --user admin --password "chosen one"
 *
 * The revocation is the point: if the account is ever suspected of being
 * compromised, changing the password alone would leave live sessions working.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import mysql from "mysql2/promise";

const scrypt = promisify(scryptCb);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readEnvFile(name) {
  try {
    const contents = readFileSync(resolve(projectRoot, name), "utf8");
    const values = {};
    for (const line of contents.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
    }
    return values;
  } catch {
    return {};
  }
}

const env = { ...readEnvFile(".env.local"), ...process.env };

function arg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const N = 32768;
const R = 8;
const P = 1;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64, { N, r: R, p: P, maxmem: 128 * N * R * 2 });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

async function main() {
  const username = arg("--user");
  if (!username) {
    console.error("Usage: npm run db:passwd -- --user <username> [--password <password>]");
    process.exit(1);
  }

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error("Missing database config in .env.local.");
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD ?? "",
    database: DB_NAME,
    charset: "utf8mb4_unicode_ci",
  });

  const [rows] = await connection.execute("SELECT id FROM admin_users WHERE username = ?", [
    username,
  ]);
  if (rows.length === 0) {
    console.error(`No admin user named "${username}".`);
    await connection.end();
    process.exit(1);
  }

  const generated = !process.argv.includes("--password");
  const password = arg("--password", randomBytes(18).toString("base64url"));
  const hash = await hashPassword(password);

  await connection.execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", [
    hash,
    rows[0].id,
  ]);
  const [revoked] = await connection.execute("DELETE FROM admin_sessions WHERE user_id = ?", [
    rows[0].id,
  ]);

  console.log(`\nPassword updated for "${username}".`);
  if (generated) console.log(`New password: ${password}`);
  console.log(`Revoked ${revoked.affectedRows} active session(s).\n`);

  await connection.end();
}

main().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
