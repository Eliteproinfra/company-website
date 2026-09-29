#!/usr/bin/env node
/**
 * Creates the CMS schema and the first admin user.
 *
 * Usage:
 *   npm run db:setup
 *   npm run db:setup -- --user admin --email you@example.com
 *
 * Safe to re-run: every table uses CREATE TABLE IF NOT EXISTS, and an existing
 * admin user is left alone rather than overwritten.
 *
 * The password is generated here and printed once. It is never written to a
 * file — the previous site's admin credentials should be treated as stolen, so
 * this deliberately does not reuse or import them.
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

// Same parameters as lib/auth/password.ts — the format must match exactly.
const N = 32768;
const R = 8;
const P = 1;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64, {
    N,
    r: R,
    p: P,
    maxmem: 128 * N * R * 2,
  });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

/** Splits the schema file on statement boundaries, ignoring `--` comments. */
function splitStatements(sql) {
  return sql
    .split(/\n/)
    .filter((line) => !/^\s*--/.test(line))
    .join("\n")
    .split(/;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function main() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error(
      "Missing database config. Set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in .env.local (see .env.example)."
    );
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD ?? "",
    database: DB_NAME,
    charset: "utf8mb4_unicode_ci",
    multipleStatements: false,
  });

  console.log(`Connected to ${DB_NAME} at ${DB_HOST}.`);

  const schema = readFileSync(resolve(projectRoot, "lib/db/schema.sql"), "utf8");
  const statements = splitStatements(schema);
  for (const statement of statements) {
    await connection.query(statement);
  }
  console.log(`Applied ${statements.length} schema statement(s).`);

  const username = arg("--user", "admin");
  const email = arg("--email", `${username}@eliteproinfra.com`);

  const [existing] = await connection.execute(
    "SELECT id FROM admin_users WHERE username = ?",
    [username]
  );

  if (existing.length > 0) {
    console.log(`\nAdmin user "${username}" already exists — left unchanged.`);
    console.log("To reset its password:  npm run db:passwd -- --user " + username);
  } else {
    // 18 random bytes -> 24 base64url chars. Generated, never a default like
    // "admin123": a guessable admin password is how sites get owned.
    const password = randomBytes(18).toString("base64url");
    const hash = await hashPassword(password);
    await connection.execute(
      "INSERT INTO admin_users (username, email, password_hash, display_name) VALUES (?,?,?,?)",
      [username, email, hash, username]
    );
    console.log("\n" + "=".repeat(58));
    console.log("  ADMIN USER CREATED — this password is shown only once");
    console.log("=".repeat(58));
    console.log(`  URL      : /admin/login`);
    console.log(`  Username : ${username}`);
    console.log(`  Password : ${password}`);
    console.log("=".repeat(58));
    console.log("  Store it in a password manager now, then sign in.\n");
  }

  await connection.end();
  console.log("Done. Next: npm run db:seed  (imports the existing static content)");
}

main().catch((error) => {
  console.error("\nSetup failed:", error.message);
  process.exit(1);
});
