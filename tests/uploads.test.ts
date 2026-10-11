/**
 * app/uploads/[...path] — serving admin-uploaded images back off disk.
 *
 * Two things are being pinned down here, and they pull in opposite directions.
 *
 * The first is the bug the route was written for: `next start` answers from a
 * public-directory snapshot taken at boot, so an image uploaded while the
 * server is running 404s until the process restarts — invisibly in production,
 * because nginx serves /uploads/ itself and only <Image> goes through Node.
 * So the route MUST read the filesystem per request, and the test writes a
 * file after the handler is imported to prove it does.
 *
 * The second is that this hands an HTTP caller a filename that becomes a path
 * on disk. The previous host was compromised through an upload endpoint, and
 * reading files back is the other half of that mistake. Those tests are
 * written as attacks: the route is asked for .env.local and for its own
 * source, by every spelling of ".." the router will pass through.
 */
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

// The route reads UPLOADS_DIR through uploadsRoot() on every call, so pointing
// it at a scratch directory before the import keeps the real public/uploads
// out of this entirely.
const previousUploadsDir = process.env.UPLOADS_DIR;
let uploadsDir: string;
let GET: typeof import("@/app/uploads/[...path]/route").GET;

/** What Next passes a catch-all route handler as its second argument. */
function context(...segments: string[]) {
  return { params: Promise.resolve({ path: segments }) } as Parameters<typeof GET>[1];
}

function request(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/uploads/x", { headers });
}

// A one-pixel PNG — real magic bytes, so nothing here depends on a stub.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

before(async () => {
  uploadsDir = await mkdtemp(path.join(tmpdir(), "elite-uploads-"));
  process.env.UPLOADS_DIR = uploadsDir;
  ({ GET } = await import("@/app/uploads/[...path]/route"));

  // Written AFTER the handler module is loaded. If the route ever grows a
  // boot-time listing — the exact defect it exists to work around — every
  // test below starts 404ing.
  await mkdir(path.join(uploadsDir, "2026-10"), { recursive: true });
  await writeFile(path.join(uploadsDir, "2026-10", "20261011-abcdef0123456789.png"), PNG);
  await writeFile(path.join(uploadsDir, "2026-10", "notes.txt"), "not an image");
  await writeFile(path.join(uploadsDir, "secret.png"), PNG);
});

after(() => {
  if (previousUploadsDir === undefined) delete process.env.UPLOADS_DIR;
  else process.env.UPLOADS_DIR = previousUploadsDir;
});

describe("GET /uploads/[...path]", () => {
  it("serves a file created after the module was loaded", async () => {
    const res = await GET(request(), context("2026-10", "20261011-abcdef0123456789.png"));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Content-Type"), "image/png");
    assert.deepEqual(Buffer.from(await res.arrayBuffer()), PNG);
  });

  it("marks the body as cacheable and never sniffable", async () => {
    const res = await GET(request(), context("2026-10", "20261011-abcdef0123456789.png"));
    assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(res.headers.get("Cache-Control"), "public, max-age=2592000");
  });

  it("answers 304 when the caller already has the current ETag", async () => {
    const first = await GET(request(), context("2026-10", "20261011-abcdef0123456789.png"));
    const etag = first.headers.get("ETag");
    assert.ok(etag, "no ETag issued");

    const second = await GET(
      request({ "If-None-Match": etag }),
      context("2026-10", "20261011-abcdef0123456789.png")
    );
    assert.equal(second.status, 304);
    assert.equal((await second.arrayBuffer()).byteLength, 0);
  });

  it("404s a path that no longer exists on disk", async () => {
    const res = await GET(request(), context("2026-10", "20261011-0000000000000000.png"));
    assert.equal(res.status, 404);
  });

  describe("path traversal", () => {
    // Each of these is a real request shape: the router hands segments over
    // without resolving them, so ".." arrives at the handler intact.
    const attacks: [string, string[]][] = [
      ["parent directory", ["..", ".env.local"]],
      ["two levels up", ["..", "..", ".env.local"]],
      ["dot-dot inside a segment", ["2026-10", "..", "..", "package.json"]],
      ["absolute-looking segment", ["", "etc/passwd"]],
      ["separator smuggled into a segment", ["2026-10", "../../.env.local"]],
      ["backslash separator", ["2026-10", "..\\..\\.env.local"]],
      ["the route's own source", ["..", "app/uploads/[...path]/route.ts"]],
    ];

    for (const [name, segments] of attacks) {
      it(`refuses ${name}`, async () => {
        const res = await GET(request(), context(...segments));
        assert.equal(res.status, 404, `${segments.join("|")} was not refused`);
        const body = await res.text();
        assert.ok(!body.includes("DB_"), "response leaked file contents");
        assert.ok(!body.includes(uploadsDir), "response leaked the path on disk");
      });
    }
  });

  describe("shape and type", () => {
    it("refuses a non-image that really is in the directory", async () => {
      const res = await GET(request(), context("2026-10", "notes.txt"));
      assert.equal(res.status, 404);
    });

    it("refuses a file outside the dated folder, even though it exists", async () => {
      const res = await GET(request(), context("secret.png"));
      assert.equal(res.status, 404);
    });

    it("refuses extra depth", async () => {
      const res = await GET(request(), context("2026-10", "nested", "x.png"));
      assert.equal(res.status, 404);
    });

    it("refuses a dotfile", async () => {
      const res = await GET(request(), context("2026-10", ".env.png"));
      assert.equal(res.status, 404);
    });

    it("serves every extension the upload route can produce", async () => {
      // Kept honest against the upload route's own sniff table: if that
      // learns a new format and this map is not updated, uploads of it would
      // save and then 404.
      for (const [extension, type] of Object.entries({
        jpg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        avif: "image/avif",
      })) {
        const name = `20261011-00000000000000ff.${extension}`;
        await writeFile(path.join(uploadsDir, "2026-10", name), PNG);
        const res = await GET(request(), context("2026-10", name));
        assert.equal(res.status, 200, `${extension} was not served`);
        assert.equal(res.headers.get("Content-Type"), type);
      }
    });
  });
});
