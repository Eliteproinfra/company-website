/**
 * The form layer: phone validation (lib/data/countryCodes.ts), the shared
 * server-side validators (lib/forms/validate.ts) and the shared submit helper
 * (lib/forms/submitEnquiry.ts).
 *
 * The submitEnquiry tests are the regression for the bug that was in all nine
 * public forms: an error response whose body is not JSON used to surface to the
 * visitor as "Unexpected token '<' ... is not valid JSON".
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { countryCodes, findCountry, validatePhoneNumber } from "@/lib/data/countryCodes";
import { formString, looksLikeEmail } from "@/lib/forms/validate";
import {
  GENERIC_SUBMIT_ERROR,
  submitEnquiry,
  submitErrorMessage,
  submitFormData,
} from "@/lib/forms/submitEnquiry";

describe("country code data", () => {
  it("has no duplicate ISO codes — the <select> uses them as keys", () => {
    const seen = new Set<string>();
    for (const country of countryCodes) {
      assert.ok(!seen.has(country.iso), `duplicate iso: ${country.iso}`);
      seen.add(country.iso);
    }
  });

  it("gives every country a sane digit range", () => {
    for (const country of countryCodes) {
      assert.ok(country.min >= 4 && country.min <= 15, `${country.iso} min=${country.min}`);
      assert.ok(country.max >= country.min && country.max <= 15, `${country.iso} max=${country.max}`);
      assert.match(country.dial, /^\+\d{1,4}$/, `${country.iso} dial=${country.dial}`);
    }
  });

  it("defaults to India for an unknown ISO", () => {
    assert.equal(findCountry("ZZ").iso, "IN");
  });
});

describe("validatePhoneNumber", () => {
  it("accepts a plain Indian mobile", () => {
    const check = validatePhoneNumber("IN", "9968686868");
    assert.equal(check.ok, true);
    if (check.ok) assert.equal(check.e164, "+919968686868");
  });

  it("ignores spaces, dashes, dots and brackets", () => {
    for (const input of ["99686 86868", "99686-86868", "(99686) 86868", "99686.86868"]) {
      const check = validatePhoneNumber("IN", input);
      assert.equal(check.ok, true, `${input} rejected`);
      if (check.ok) assert.equal(check.e164, "+919968686868");
    }
  });

  it("accepts the dial code pasted in, with or without the +", () => {
    for (const input of ["+91 99686-86868", "919968686868", "0091 9968686868"]) {
      const check = validatePhoneNumber("IN", input);
      assert.equal(check.ok, true, `${input} rejected`);
      if (check.ok) assert.equal(check.e164, "+919968686868");
    }
  });

  it("drops a single trunk zero", () => {
    const check = validatePhoneNumber("IN", "09968686868");
    assert.equal(check.ok, true);
    if (check.ok) assert.equal(check.e164, "+919968686868");
  });

  it("leaves a local number alone when it merely starts with the dial digits", () => {
    // "9168686868" on +91 is a valid 10-digit Indian number, not "91" + 8 digits.
    const check = validatePhoneNumber("IN", "9168686868");
    assert.equal(check.ok, true);
    if (check.ok) assert.equal(check.e164, "+919168686868");
  });

  it("accepts the 8-digit Gulf and Singapore lengths the old flat 10-12 range refused", () => {
    // This is the regression the per-country ranges were added for: at a flat
    // 10-12 digits every Gulf corridor, Singapore and Hong Kong was rejected.
    const cases: [string, string][] = [
      ["AE", "501234567"], // UAE, 9
      ["SG", "81234567"], // Singapore, 8
      ["QA", "33123456"], // Qatar, 8
      ["HK", "51234567"], // Hong Kong, 8
      ["OM", "91234567"], // Oman, 8
    ];
    for (const [iso, number] of cases) {
      const check = validatePhoneNumber(iso, number);
      assert.equal(check.ok, true, `${iso} ${number}: ${check.ok ? "" : check.error}`);
    }
  });

  it("rejects a number that is too short or too long for its country", () => {
    assert.equal(validatePhoneNumber("IN", "99686").ok, false);
    assert.equal(validatePhoneNumber("IN", "99686868681234").ok, false);
  });

  it("rejects an empty number with a usable message", () => {
    const check = validatePhoneNumber("IN", "   ");
    assert.equal(check.ok, false);
    if (!check.ok) assert.match(check.error, /enter your phone number/i);
  });

  it("rejects letters", () => {
    const check = validatePhoneNumber("IN", "99686ABCDE");
    assert.equal(check.ok, false);
  });

  it("explains a mismatch when the typed country code is not the selected one", () => {
    const check = validatePhoneNumber("IN", "+44 7700900000");
    assert.equal(check.ok, false);
    if (!check.ok) assert.match(check.error, /different country code/i);
  });
});

describe("looksLikeEmail", () => {
  it("accepts ordinary addresses", () => {
    for (const value of [
      "a@b.test",
      "first.last@example.co.in",
      "user+tag@example.test",
      "UPPER@EXAMPLE.TEST",
    ]) {
      assert.equal(looksLikeEmail(value), true, value);
    }
  });

  it("rejects obvious junk", () => {
    for (const value of [
      "",
      "not-an-email",
      "@example.test",
      "a@",
      "a@b", // no dot in the domain
      "a b@example.test",
      "a@example .test",
      `${"a".repeat(200)}@example.test`,
    ]) {
      assert.equal(looksLikeEmail(value), false, JSON.stringify(value));
    }
  });
});

describe("formString", () => {
  it("trims a string field", () => {
    const form = new FormData();
    form.set("name", "  Priya  ");
    assert.equal(formString(form, "name"), "Priya");
  });

  it("returns an empty string for a missing field or a File", () => {
    const form = new FormData();
    form.set("resume", new File(["x"], "cv.pdf"));
    assert.equal(formString(form, "missing"), "");
    assert.equal(formString(form, "resume"), "");
  });
});

describe("submitEnquiry error handling", () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  /** Replaces fetch with one that returns exactly this response. */
  function stubFetch(response: Response | (() => never)) {
    globalThis.fetch = (async () => {
      if (typeof response === "function") response();
      return response;
    }) as typeof fetch;
  }

  const body = { source: "Test", fields: { Name: "A" } };

  it("resolves on a 200", async () => {
    stubFetch(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await submitEnquiry(body); // must not throw
  });

  it("surfaces the route's own error message", async () => {
    stubFetch(
      new Response(JSON.stringify({ error: "Please fill in the required fields." }), {
        status: 400,
      })
    );
    await assert.rejects(() => submitEnquiry(body), /Please fill in the required fields/);
  });

  it("does NOT leak a JSON parse error when the body is HTML", async () => {
    // THE REGRESSION. nginx answers limit_req with an HTML page, and
    // `(await res.json()).error` threw a SyntaxError that the form then showed
    // to the visitor verbatim.
    stubFetch(new Response("<html><body><h1>429 Too Many Requests</h1></body></html>", { status: 429 }));
    await assert.rejects(
      () => submitEnquiry(body),
      (error: Error) => {
        assert.ok(!/JSON|token/i.test(error.message), `leaked parse error: ${error.message}`);
        assert.match(error.message, /wait a minute/i);
        return true;
      }
    );
  });

  it("maps 413, 502, 503 and 504 to readable messages", async () => {
    const cases: [number, RegExp][] = [
      [413, /too large/i],
      [502, /briefly unavailable/i],
      [503, /briefly unavailable/i],
      [504, /briefly unavailable/i],
    ];
    for (const [status, pattern] of cases) {
      stubFetch(new Response("<html>nginx</html>", { status }));
      await assert.rejects(() => submitEnquiry(body), pattern, `status ${status}`);
    }
  });

  it("falls back to the generic message on an empty or useless JSON error", async () => {
    for (const payload of ["{}", '{"error":null}', '{"error":"  "}']) {
      stubFetch(new Response(payload, { status: 500 }));
      await assert.rejects(() => submitEnquiry(body), new RegExp(GENERIC_SUBMIT_ERROR));
    }
  });

  it("reports a network failure as a connection problem", async () => {
    stubFetch(() => {
      throw new TypeError("Failed to fetch");
    });
    await assert.rejects(() => submitEnquiry(body), /connection/i);
  });

  it("applies the same rules to the multipart path", async () => {
    stubFetch(new Response("<html>429</html>", { status: 429 }));
    await assert.rejects(
      () => submitFormData("/api/career-application", new FormData()),
      /wait a minute/i
    );

    stubFetch(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await submitFormData("/api/career-application", new FormData());
  });
});

describe("submitErrorMessage", () => {
  it("uses an Error's message", () => {
    assert.equal(submitErrorMessage(new Error("boom")), "boom");
  });

  it("falls back for a non-Error or an empty message", () => {
    assert.equal(submitErrorMessage("a string"), GENERIC_SUBMIT_ERROR);
    assert.equal(submitErrorMessage(new Error("")), GENERIC_SUBMIT_ERROR);
    assert.equal(submitErrorMessage(undefined), GENERIC_SUBMIT_ERROR);
  });
});
