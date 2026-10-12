/**
 * lib/uploads — deciding what an uploaded file actually is.
 *
 * The extension an upload is stored under comes from its magic bytes, never
 * from the client's filename, so this is the allowlist that keeps a .php off
 * disk. It is also, in the other direction, the thing that decides whether the
 * marketing team can add a photo at all: a format it fails to recognise is
 * refused, and the admin is told the file is unsupported.
 *
 * Both directions are pinned here. The cases that matter in practice are the
 * ISO-BMFF ones, because AVIF and HEIC share a container and are told apart
 * only by the brands in the `ftyp` box.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UPLOAD_CONTENT_TYPES, isHeif, sniffExtension } from "@/lib/uploads";

/**
 * An ISO-BMFF header: `size | 'ftyp' | major | minor | compatible_brands[]`,
 * padded past the 12-byte floor sniffExtension applies. Real AVIF and HEIC
 * files start with exactly this.
 */
function ftyp(major: string, ...compatible: string[]): Buffer {
  const brands = Buffer.from([major, ...compatible].join(""), "ascii");
  const box = Buffer.concat([
    Buffer.alloc(4), // size, filled in below
    Buffer.from("ftyp", "ascii"),
    brands.subarray(0, 4), // major_brand
    Buffer.from([0, 0, 0, 0]), // minor_version
    brands.subarray(4), // compatible_brands
  ]);
  box.writeUInt32BE(box.length, 0);
  // Trailing bytes stand in for the meta/mdat boxes that follow in a real file.
  return Buffer.concat([box, Buffer.alloc(32)]);
}

const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(16)]);
const PNG = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(16),
]);
const GIF = Buffer.concat([Buffer.from("GIF89a", "ascii"), Buffer.alloc(16)]);
const WEBP = Buffer.concat([
  Buffer.from("RIFF", "ascii"),
  Buffer.alloc(4),
  Buffer.from("WEBP", "ascii"),
  Buffer.alloc(16),
]);

describe("sniffExtension", () => {
  it("recognises the ordinary formats by signature", () => {
    assert.equal(sniffExtension(JPEG), "jpg");
    assert.equal(sniffExtension(PNG), "png");
    assert.equal(sniffExtension(GIF), "gif");
    assert.equal(sniffExtension(WEBP), "webp");
  });

  it("names every extension the serving table can answer for", () => {
    // The pairing app/uploads/[...path] depends on: a format accepted here but
    // missing from UPLOAD_CONTENT_TYPES would save and then 404 forever.
    for (const buffer of [JPEG, PNG, GIF, WEBP, ftyp("avif")]) {
      const extension = sniffExtension(buffer);
      assert.ok(extension, "a known image was not recognised");
      assert.ok(
        extension in UPLOAD_CONTENT_TYPES,
        `${extension} is accepted but cannot be served back`
      );
    }
  });

  it("accepts AVIF whatever order the brands are declared in", () => {
    assert.equal(sniffExtension(ftyp("avif")), "avif");
    assert.equal(sniffExtension(ftyp("avis")), "avif");
    // The case this was getting wrong: a generic major brand with the real one
    // in the compatible list. Reading bytes 8-12 alone refused these as an
    // unknown format even though they are ordinary encoder output.
    assert.equal(sniffExtension(ftyp("mif1", "avif", "miaf")), "avif");
    assert.equal(sniffExtension(ftyp("msf1", "avis", "avif")), "avif");
  });

  it("refuses HEIC, and anything that is not an image at all", () => {
    assert.equal(sniffExtension(ftyp("heic", "mif1")), null);
    assert.equal(sniffExtension(Buffer.from("<?php system($_GET[0]); ?>", "ascii")), null);
    assert.equal(sniffExtension(Buffer.from("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n", "latin1")), null);
  });

  it("refuses a file too short to carry a signature", () => {
    assert.equal(sniffExtension(Buffer.alloc(0)), null);
    assert.equal(sniffExtension(Buffer.from([0xff, 0xd8, 0xff])), null);
  });

  it("does not walk the whole file looking for brands", () => {
    // A ftyp box claiming to be enormous must not send the brand scan through
    // megabytes of pixel data.
    const buffer = Buffer.concat([ftyp("heic"), Buffer.alloc(4 * 1024 * 1024)]);
    buffer.writeUInt32BE(0xffffffff, 0);
    assert.equal(sniffExtension(buffer), null);
    assert.equal(isHeif(buffer), true);
  });
});

describe("isHeif", () => {
  it("is true for the brands an iPhone writes", () => {
    for (const brand of ["heic", "heix", "hevc", "heim", "mif1", "msf1"]) {
      assert.equal(isHeif(ftyp(brand)), true, `${brand} was not seen as HEIC`);
    }
  });

  it("is false for AVIF sharing the same container and compatible brands", () => {
    // Otherwise an AVIF would be refused with "this is an iPhone HEIC photo".
    assert.equal(isHeif(ftyp("avif", "mif1", "miaf")), false);
    assert.equal(isHeif(ftyp("mif1", "avif")), false);
  });

  it("is false for everything that is not an ISO-BMFF file", () => {
    for (const buffer of [JPEG, PNG, GIF, WEBP, Buffer.alloc(0)]) {
      assert.equal(isHeif(buffer), false);
    }
  });
});
