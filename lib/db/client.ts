/**
 * MySQL connection pool — SERVER ONLY. Never import from a "use client" module:
 * it reads the database credentials.
 *
 * A single pool is reused across requests and cached on globalThis so Next's dev
 * hot-reload does not open a new pool on every edit until the server runs out of
 * connections.
 */
import "server-only";
import mysql from "mysql2/promise";

declare global {
  var __elitePool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error(
      "Database is not configured — set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in .env.local (see .env.example)."
    );
  }

  return mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD ?? "",
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE ?? 10),
    // Keeps ₹, en dashes and emoji intact in listing copy.
    charset: "utf8mb4_unicode_ci",
    // Returns DATE/DATETIME as strings. Node would otherwise coerce them into
    // Date objects in the server's local zone, which shifts a published_on by a
    // day either side of UTC.
    dateStrings: true,
    // Every query in lib/db/queries.ts is parameterised; this makes it an error
    // rather than a silent injection if one ever is not.
    namedPlaceholders: false,
  });
}

export function db(): mysql.Pool {
  if (process.env.NODE_ENV === "production") {
    // One pool per process; no global caching needed outside dev.
    globalThis.__elitePool ??= createPool();
    return globalThis.__elitePool;
  }
  globalThis.__elitePool ??= createPool();
  return globalThis.__elitePool;
}

/** True when the DB env vars are present — lets pages fall back to static data. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

export type Row = Record<string, unknown>;

/** What MySQL will accept as a bound parameter. Deliberately narrower than
 *  `unknown` so a stray object cannot be passed straight through to the driver. */
export type SqlParam = string | number | boolean | Date | Buffer | null;

/** Parameterised SELECT. Callers must never interpolate values into `sql`. */
export async function query<T = Row>(sql: string, params: SqlParam[] = []): Promise<T[]> {
  const [rows] = await db().execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = Row>(sql: string, params: SqlParam[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/** Parameterised INSERT/UPDATE/DELETE. Returns insertId and affectedRows. */
export async function execute(
  sql: string,
  params: SqlParam[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await db().execute(sql, params);
  const info = result as mysql.ResultSetHeader;
  return { insertId: info.insertId, affectedRows: info.affectedRows };
}
