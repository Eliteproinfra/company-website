/**
 * The pure logic behind the property detail-page sections: the video embed
 * allowlist, the amenity catalog the picker and the public page share, and the
 * icon lookups.
 *
 * The one with teeth is videoEmbedUrl. Its input is an admin form field and its
 * output lands in an iframe `src`, so "only YouTube and Vimeo, rebuilt from the
 * extracted id" has to hold for every shape of input, not just the tidy ones.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  amenityCatalog,
  amenityKey,
  findCatalogAmenity,
  FALLBACK_AMENITY_ICON,
} from "@/lib/data/amenityCatalog";
import { keyFactIcon } from "@/lib/data/keyFacts";
import { nearbyCategories, nearbyCategoryIcon } from "@/lib/data/nearbyCategories";
import { videoEmbedUrl } from "@/lib/video";

describe("videoEmbedUrl", () => {
  it("accepts a plain YouTube watch link", () => {
    assert.equal(
      videoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    );
  });

  it("accepts youtu.be, /embed/ and /shorts/ forms", () => {
    const expected = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
    assert.equal(videoEmbedUrl("https://youtu.be/dQw4w9WgXcQ"), expected);
    assert.equal(videoEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ"), expected);
    assert.equal(videoEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ"), expected);
  });

  it("drops the tracking and timestamp parameters that come with a share link", () => {
    assert.equal(
      videoEmbedUrl("https://youtu.be/dQw4w9WgXcQ?si=AbCdEf&t=42"),
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    );
  });

  it("accepts a Vimeo link", () => {
    assert.equal(videoEmbedUrl("https://vimeo.com/76979871"), "https://player.vimeo.com/video/76979871");
  });

  it("tolerates surrounding whitespace from a paste", () => {
    assert.equal(
      videoEmbedUrl("  https://youtu.be/dQw4w9WgXcQ  "),
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    );
  });

  it("refuses a host that merely looks like YouTube", () => {
    assert.equal(videoEmbedUrl("https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ"), null);
    assert.equal(videoEmbedUrl("https://notyoutube.com/watch?v=dQw4w9WgXcQ"), null);
  });

  it("refuses a javascript: or data: URL", () => {
    assert.equal(videoEmbedUrl("javascript:alert(1)"), null);
    assert.equal(videoEmbedUrl("data:text/html,<script>alert(1)</script>"), null);
  });

  it("refuses anything that is not a URL at all", () => {
    assert.equal(videoEmbedUrl(""), null);
    assert.equal(videoEmbedUrl("dQw4w9WgXcQ"), null);
  });

  it("refuses an id of the wrong shape, so nothing unvetted reaches the src", () => {
    assert.equal(videoEmbedUrl("https://www.youtube.com/watch?v=../../etc"), null);
    assert.equal(videoEmbedUrl("https://vimeo.com/not-a-number"), null);
    assert.equal(videoEmbedUrl("https://www.youtube.com/watch"), null);
  });
});

describe("amenity catalog", () => {
  const items = amenityCatalog.flatMap((group) => group.items);

  it("has no duplicate name, because the name is the identity of a row", () => {
    const keys = items.map((item) => amenityKey(item.name));
    assert.equal(new Set(keys).size, keys.length);
  });

  it("gives every entry a full Font Awesome class", () => {
    for (const item of items) {
      assert.ok(
        item.icon.startsWith("fas fa-"),
        `${item.name} has "${item.icon}", which the public page cannot render`
      );
    }
  });

  it("matches a saved name regardless of case and spacing", () => {
    assert.equal(findCatalogAmenity("power backup")?.icon, findCatalogAmenity("Power backup")?.icon);
    assert.equal(findCatalogAmenity("  SWIMMING   POOL ")?.name, "Swimming Pool");
  });

  it("returns nothing for a name an admin typed themselves", () => {
    assert.equal(findCatalogAmenity("Helipad"), undefined);
    assert.ok(FALLBACK_AMENITY_ICON.startsWith("fas fa-"));
  });

  it("pairs the icons that were mismatched in the seeded listings", () => {
    // These three are why the picker exists: the data had a swimming pool on
    // "CCTV surveillance" and a spa on "Lift".
    assert.equal(findCatalogAmenity("CCTV surveillance")?.icon, "fas fa-video");
    assert.equal(findCatalogAmenity("Lift")?.icon, "fas fa-elevator");
    assert.equal(findCatalogAmenity("GYM")?.icon, "fas fa-dumbbell");
  });
});

describe("keyFactIcon", () => {
  it("matches on a word inside the label the admin typed", () => {
    assert.equal(keyFactIcon("Super Built-up Area (sq.ft.)"), "fas fa-ruler-combined");
    assert.equal(keyFactIcon("Bathrooms"), "fas fa-bath");
    assert.equal(keyFactIcon("Possession"), "fas fa-calendar-check");
  });

  it("prefers the more specific rule when a label could match two", () => {
    // "Bathrooms" contains neither "bed" nor "floor", but "Bathroom Floor"
    // contains both — the bathroom rule is listed first and should win.
    assert.equal(keyFactIcon("Bathroom Flooring"), "fas fa-bath");
  });

  it("ignores case", () => {
    assert.equal(keyFactIcon("FACING"), keyFactIcon("facing"));
  });

  it("falls back to a neutral icon for an unknown label", () => {
    assert.equal(keyFactIcon("Zoning board reference"), "fas fa-circle-info");
  });
});

describe("nearbyCategoryIcon", () => {
  it("knows every category the admin can pick", () => {
    for (const category of nearbyCategories) {
      assert.equal(nearbyCategoryIcon(category.name), category.icon);
    }
  });

  it("falls back to a pin for a category saved before the list changed", () => {
    assert.equal(nearbyCategoryIcon("Bus Stops"), "fas fa-map-marker-alt");
    assert.equal(nearbyCategoryIcon(""), "fas fa-map-marker-alt");
  });
});
