/**
 * lib/price.ts and lib/data/localities.ts — the two readers behind the
 * /properties Budget box and "Top Localities" cards.
 *
 * Both work on free text nobody structured: prices are typed into the admin as
 * "₹ 3.22 - 11.21 Cr" or "4CR ONWARDS", and a listing's locality exists only in
 * its description, where the same road is named both as an address and as
 * somewhere the project merely connects to.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { stageFromText } from "@/lib/data/categories";
import { localitiesInText } from "@/lib/data/localities";
import { parseBudget, priceInRupees } from "@/lib/price";

describe("stageFromText", () => {
  const now = new Date(2026, 9, 24);

  it("reads the stage the admin's Status names", () => {
    assert.equal(stageFromText("Ready To Move", now), "ready-to-move");
    assert.equal(stageFromText("Under Construction", now), "under-construction");
    assert.equal(stageFromText("New Launch", now), "new-launch");
    assert.equal(stageFromText("Pre-Launch", now), "new-launch");
    assert.equal(stageFromText("Nearing Possession", now), "nearing-possession");
  });

  it("calls a possession date within a year Nearing Possession", () => {
    assert.equal(stageFromText("Under Construction Dec 2026", now), "nearing-possession");
    assert.equal(stageFromText("Possession: March, 2027", now), "nearing-possession");
    assert.equal(stageFromText("Q3 2027", now), "nearing-possession");
  });

  it("calls a later possession date Under Construction", () => {
    assert.equal(stageFromText("Under Construction Dec 2027", now), "under-construction");
    assert.equal(stageFromText("Possession 2029", now), "under-construction");
  });

  it("lets a past possession date fall back to the Status", () => {
    assert.equal(stageFromText("Under Construction Jan 2025", now), "under-construction");
    assert.equal(stageFromText("Jan 2025", now), undefined);
  });

  it("has no stage for a blank Status", () => {
    assert.equal(stageFromText("", now), undefined);
    assert.equal(stageFromText(undefined, now), undefined);
  });
});

describe("priceInRupees", () => {
  it("reads crore and lakh in the spellings the catalogue uses", () => {
    assert.equal(priceInRupees("18.75 CR*"), 187_500_000);
    assert.equal(priceInRupees("4CR ONWARDS"), 40_000_000);
    assert.equal(priceInRupees("₹95.05 Lakh*"), 9_505_000);
    assert.equal(priceInRupees("₹ 50 Lakh"), 5_000_000);
  });

  it("takes the starting figure of a range", () => {
    assert.equal(priceInRupees("₹ 3.22 - 11.21 Cr"), 32_200_000);
  });

  it("has no figure for a price on request", () => {
    assert.equal(priceInRupees("Price On Request"), undefined);
    assert.equal(priceInRupees("₹ On Request*"), undefined);
  });

  it("ranks a lakh price below a crore one", () => {
    assert.ok(priceInRupees("₹ 50 Lakh")! < priceInRupees("₹ 1.60 Cr")!);
  });
});

describe("parseBudget", () => {
  it("reads the units a visitor is likely to type", () => {
    assert.equal(parseBudget("5 Cr"), 50_000_000);
    assert.equal(parseBudget("2.5 crore"), 25_000_000);
    assert.equal(parseBudget("50 lakh"), 5_000_000);
    assert.equal(parseBudget("80L"), 8_000_000);
    assert.equal(parseBudget("75 lacs"), 7_500_000);
  });

  it("reads a bare small number as crore and a long one as rupees", () => {
    assert.equal(parseBudget("5"), 50_000_000);
    assert.equal(parseBudget("2,50,00,000"), 25_000_000);
  });

  it("rejects text with no amount in it", () => {
    assert.equal(parseBudget("cheap"), undefined);
    assert.equal(parseBudget(""), undefined);
    assert.equal(parseBudget("0"), undefined);
  });
});

describe("localitiesInText", () => {
  it("files a listing under the road it stands on", () => {
    assert.deepEqual(
      localitiesInText("Located in DLF Phase 5 along Golf Course Road.", "Gurgaon"),
      ["golf-course-rd"]
    );
  });

  it("ignores a locality the project only connects to", () => {
    assert.deepEqual(
      localitiesInText(
        "It enjoys seamless connectivity to Golf Course Road, NH-48, Dwarka Expressway and Cyber City.",
        "Gurgaon"
      ),
      []
    );
  });

  it("does not take Golf Course Extension Road for Golf Course Road", () => {
    assert.deepEqual(
      localitiesInText("Situated on Golf Course Extension Road in Sector 65.", "Gurgaon"),
      []
    );
  });

  it("files a sector inside the range under New Gurgaon", () => {
    assert.deepEqual(localitiesInText("Its location in Sector 90 is a draw.", "Gurgaon"), [
      "new-gurgaon",
    ]);
    assert.deepEqual(localitiesInText("Situated in Sector 54.", "Gurgaon"), []);
  });

  it("only considers localities of the listing's own city", () => {
    assert.deepEqual(
      localitiesInText("Rates climb in core Gurgaon along Golf Course Road.", "Manesar"),
      []
    );
  });
});
