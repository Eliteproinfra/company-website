/**
 * Password hashing — scrypt from node:crypto.
 *
 * Deliberately dependency-free. bcrypt needs a native build (painful on Windows,
 * and a compile step on the VPS); scrypt is memory-hard, in the standard library,
 * and is what Node itself recommends for password storage.
 *
 * Stored format: scrypt$<N>$<r>$<p>$<salt-base64>$<hash-base64>
 * The parameters travel with the hash, so they can be raised later without
 * invalidating existing passwords.
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>;

// N=2^15 keeps a single hash around ~100ms on modest VPS hardware — costly to
// brute-force, cheap enough for an interactive login.
const N = 32768;
const r = 8;
const p = 1;
const KEY_LENGTH = 64;
// scrypt's default maxmem (32MB) is below what N=32768,r=8 needs (~128 * N * r).
const MAXMEM = 128 * N * r * 2;

export async function hashPassword(password: string): Promise<string> {
  if (!password) throw new Error("Password must not be empty");
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, { N, r, p, maxmem: MAXMEM });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

/**
 * Constant-time verification. Returns false rather than throwing on a malformed
 * stored value, so a corrupt row denies access instead of 500-ing the login.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;

    const storedN = Number(parts[1]);
    const storedR = Number(parts[2]);
    const storedP = Number(parts[3]);
    const salt = Buffer.from(parts[4], "base64");
    const expected = Buffer.from(parts[5], "base64");

    if (!Number.isInteger(storedN) || !Number.isInteger(storedR) || !Number.isInteger(storedP)) {
      return false;
    }
    if (salt.length === 0 || expected.length === 0) return false;

    const derived = await scrypt(password, salt, expected.length, {
      N: storedN,
      r: storedR,
      p: storedP,
      maxmem: 128 * storedN * storedR * 2,
    });

    // Lengths match by construction, but timingSafeEqual throws if they differ.
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
