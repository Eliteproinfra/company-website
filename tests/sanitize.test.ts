/**
 * lib/db/sanitize.ts — the HTML allowlist.
 *
 * This is the most security-critical pure function in the project: article and
 * property-description bodies are stored through it and then rendered with
 * dangerouslySetInnerHTML, so anything that survives sanitising executes in
 * every visitor's browser. The previous host was compromised by a webshell
 * whose standard payload is injecting <script> beacons and hidden link farms
 * into exactly this kind of column.
 *
 * The tests are therefore written as attacks, not as examples.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { htmlToText, sanitizeArticleHtml } from "@/lib/db/sanitize";

describe("sanitizeArticleHtml", () => {
  it("keeps allowlisted formatting", () => {
    const out = sanitizeArticleHtml("<p>Hello <strong>world</strong></p>");
    assert.equal(out, "<p>Hello <strong>world</strong></p>");
  });

  it("returns an empty string for nullish input", () => {
    assert.equal(sanitizeArticleHtml(null), "");
    assert.equal(sanitizeArticleHtml(undefined), "");
    assert.equal(sanitizeArticleHtml(""), "");
  });

  describe("script injection", () => {
    it("drops a script element and its contents", () => {
      const out = sanitizeArticleHtml('<p>ok</p><script>alert("xss")</script>');
      assert.equal(out, "<p>ok</p>");
      assert.ok(!out.includes("alert"));
    });

    it("drops an unclosed script tag", () => {
      const out = sanitizeArticleHtml('<p>ok</p><script src="//evil.test/x.js">');
      assert.ok(!out.includes("script"));
      assert.ok(!out.includes("evil.test"));
    });

    it("drops style, iframe, object, embed and form wholesale", () => {
      for (const tag of ["style", "iframe", "object", "embed", "form", "noscript", "template"]) {
        const out = sanitizeArticleHtml(`<p>a</p><${tag}>PAYLOAD</${tag}>`);
        assert.ok(!out.includes("PAYLOAD"), `${tag} contents leaked: ${out}`);
        assert.ok(!out.includes(`<${tag}`), `${tag} survived: ${out}`);
      }
    });
  });

  describe("event handlers", () => {
    it("strips onerror from an allowlisted tag", () => {
      const out = sanitizeArticleHtml('<img src="/a.png" onerror="alert(1)">');
      assert.ok(!out.includes("onerror"));
      assert.ok(!out.includes("alert"));
      assert.ok(out.includes('src="/a.png"'));
    });

    it("strips onclick and onload from a span and a div", () => {
      const out = sanitizeArticleHtml('<span onclick="x()">a</span><div onload="y()">b</div>');
      assert.ok(!/on(click|load)/i.test(out), out);
    });

    it("strips a mixed-case event handler", () => {
      const out = sanitizeArticleHtml('<img src="/a.png" OnErRoR="alert(1)">');
      assert.ok(!/onerror/i.test(out), out);
    });
  });

  describe("URL schemes", () => {
    it("drops a javascript: href but keeps the link text", () => {
      const out = sanitizeArticleHtml('<a href="javascript:alert(1)">click</a>');
      assert.ok(!out.includes("javascript"), out);
      assert.ok(out.includes("click"), out);
    });

    it("drops a data: src — data:text/html is an XSS vector", () => {
      const out = sanitizeArticleHtml('<img src="data:text/html;base64,PHNjcmlwdD4=">');
      assert.ok(!out.includes("data:"), out);
    });

    it("drops vbscript: and a control-character-obfuscated javascript:", () => {
      assert.ok(!sanitizeArticleHtml('<a href="vbscript:msgbox(1)">x</a>').includes("vbscript"));
      // "java\tscript:" — the tab is stripped before the scheme is matched, so
      // this must not be let through as if it were a relative path.
      const out = sanitizeArticleHtml('<a href="java\tscript:alert(1)">x</a>');
      assert.ok(!/javascript/i.test(out.replace(/\s/g, "")), out);
    });

    it("keeps https, root-relative, anchor, mailto and tel", () => {
      for (const href of ["https://example.test/p", "/about", "#top", "mailto:a@b.test", "tel:+911234567890"]) {
        const out = sanitizeArticleHtml(`<a href="${href}">x</a>`);
        assert.ok(out.includes("href="), `${href} was dropped: ${out}`);
      }
    });

    it("forces noopener noreferrer on an external link", () => {
      const out = sanitizeArticleHtml('<a href="https://example.test">x</a>');
      assert.ok(out.includes('rel="noopener noreferrer"'), out);
      assert.ok(out.includes('target="_blank"'), out);
    });

    it("replaces an attacker-supplied rel on an external link", () => {
      const out = sanitizeArticleHtml('<a href="https://example.test" rel="dofollow">x</a>');
      assert.ok(!out.includes("dofollow"), out);
      assert.ok(out.includes('rel="noopener noreferrer"'), out);
    });
  });

  describe("attributes", () => {
    it("drops style, which is how injected spam hides itself", () => {
      const out = sanitizeArticleHtml('<p style="display:none">hidden link farm</p>');
      assert.ok(!out.includes("style"), out);
      assert.ok(out.includes("hidden link farm"), out);
    });

    it("keeps only the allowlisted attributes on img", () => {
      const out = sanitizeArticleHtml(
        '<img src="/a.png" alt="a" width="10" height="5" srcset="/evil.png" data-x="1">'
      );
      assert.ok(out.includes('alt="a"'), out);
      assert.ok(out.includes('width="10"'), out);
      assert.ok(!out.includes("srcset"), out);
      assert.ok(!out.includes("data-x"), out);
    });

    it("escapes a quote inside an attribute value so it cannot break out", () => {
      // The payload tries to end the alt="" value early and start a new
      // onerror attribute. The sanitiser re-escapes the ampersand, so the
      // "&quot;" arrives as the literal text &quot; inside alt and never
      // becomes a quote character the parser would act on.
      const out = sanitizeArticleHtml('<img src="/a.png" alt="a&quot; onerror=&quot;alert(1)">');

      // No attribute boundary followed by onerror — i.e. onerror never becomes
      // an attribute of its own.
      assert.ok(!/"\s+onerror/i.test(out), `attribute breakout: ${out}`);
      // The ampersand is escaped, which is what keeps it inert: the browser
      // reads "&amp;quot;" as the four characters &quot; and leaves alt open.
      assert.ok(out.includes("&amp;quot;"), out);
      // There is exactly one quoted alt value, so "onerror" is inside it.
      // (A regex cannot tell an attribute from text within one, which is why
      // this asserts the escaping instead of counting attributes.)
      assert.ok(!out.includes('"onerror'), out);
    });
  });

  describe("structure", () => {
    it("unwraps an unknown tag but keeps its text", () => {
      const out = sanitizeArticleHtml("<marquee>scrolling</marquee>");
      assert.equal(out, "scrolling");
    });

    it("closes tags left open, so the page layout cannot be hijacked", () => {
      const out = sanitizeArticleHtml("<p>a<strong>b");
      assert.equal(out, "<p>a<strong>b</strong></p>");
    });

    it("ignores a stray closing tag", () => {
      const out = sanitizeArticleHtml("a</p>b");
      assert.equal(out, "ab");
    });

    it("escapes bare angle brackets in text", () => {
      const out = sanitizeArticleHtml("5 < 6 and 7 > 6");
      assert.ok(out.includes("&lt;"), out);
      assert.ok(out.includes("&gt;"), out);
    });

    it("drops HTML comments, which can carry conditional-comment payloads", () => {
      const out = sanitizeArticleHtml("<p>a</p><!--[if IE]><script>x</script><![endif]-->");
      assert.ok(!out.includes("script"), out);
    });

    it("is idempotent — sanitising stored output again changes nothing", () => {
      const once = sanitizeArticleHtml('<p>a<script>x</script><a href="https://e.test">l</a></p>');
      assert.equal(sanitizeArticleHtml(once), once);
    });
  });
});

describe("htmlToText", () => {
  it("strips tags and collapses whitespace", () => {
    assert.equal(htmlToText("<p>Hello   <strong>world</strong></p>"), "Hello world");
  });

  it("drops script and style contents rather than exposing them as text", () => {
    assert.equal(htmlToText("<p>a</p><script>alert(1)</script>"), "a");
    assert.ok(!htmlToText("<style>.a{color:red}</style>b").includes("color"));
  });

  it("decodes the entities it claims to", () => {
    assert.equal(htmlToText("a&nbsp;&amp;&lt;&gt;&quot;b"), 'a &<>"b');
  });

  it("truncates with an ellipsis at maxLength", () => {
    const out = htmlToText("<p>abcdefghij</p>", 5);
    assert.equal(out, "abcde…");
  });

  it("does not truncate when maxLength is 0 or the text is shorter", () => {
    assert.equal(htmlToText("<p>abc</p>", 0), "abc");
    assert.equal(htmlToText("<p>abc</p>", 99), "abc");
  });

  it("returns an empty string for nullish input", () => {
    assert.equal(htmlToText(null), "");
    assert.equal(htmlToText(undefined), "");
  });
});
