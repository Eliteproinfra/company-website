/**
 * lib/auth/password.ts — scrypt hashing for the admin login.
 *
 * The property that matters is that verifyPassword never throws: it is called
 * on every login attempt, including against the DUMMY_HASH used to keep a
 * missing username and a wrong password the same latency. If a malformed stored
 * value threw, a corrupt row would 500 the login page instead of denying
 * access, and the error itself would reveal that the username exists.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

// scrypt at N=32768 is ~100ms per hash by design, so each of these costs real
// time. The suite is kept deliberately small for that reason.
describe("password hashing", () => {
  it("round-trips a correct password", async () => {
    const stored = await hashPassword("correct horse battery staple");
    assert.equal(await verifyPassword("correct horse battery staple", stored), true);
  });

  it("rejects a wrong password", async () => {
    const stored = await hashPassword("right");
    assert.equal(await verifyPassword("wrong", stored), false);
  });

  it("is case- and whitespace-sensitive", async () => {
    const stored = await hashPassword("Secret");
    assert.equal(await verifyPassword("secret", stored), false);
    assert.equal(await verifyPassword("Secret ", stored), false);
  });

  it("salts, so the same password hashes differently each time", async () => {
    const a = await hashPassword("same");
    const b = await hashPassword("same");
    assert.notEqual(a, b);
    // ...and both still verify.
    assert.equal(await verifyPassword("same", a), true);
    assert.equal(await verifyPassword("same", b), true);
  });

  it("records the parameters in the stored value so they can be raised later", async () => {
    const stored = await hashPassword("x");
    const parts = stored.split("$");
    assert.equal(parts.length, 6);
    assert.equal(parts[0], "scrypt");
    assert.equal(parts[1], "32768"); // N
    assert.equal(parts[2], "8"); // r
    assert.equal(parts[3], "1"); // p
  });

  it("refuses to hash an empty password", async () => {
    await assert.rejects(() => hashPassword(""));
  });

  describe("malformed stored values deny rather than throw", () => {
    const malformed = [
      "",
      "not-a-hash",
      "bcrypt$10$abc$def$ghi$jkl", // wrong algorithm label
      "scrypt$32768$8$1$onlyfivefields",
      "scrypt$notanumber$8$1$c2FsdA==$aGFzaA==",
      "scrypt$32768$8$1$$aGFzaA==", // empty salt
      "scrypt$32768$8$1$c2FsdA==$", // empty hash
      "scrypt$32768$8$1$c2FsdA==$aGFzaA==$extra",
    ];

    for (const stored of malformed) {
      it(`returns false for ${JSON.stringify(stored)}`, async () => {
        assert.equal(await verifyPassword("anything", stored), false);
      });
    }
  });
});
