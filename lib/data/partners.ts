export type Partner = {
  name: string;
  image: string;
  /**
   * Extra spellings the catalogue uses for this developer.
   *
   * A listing's `developer.name` is inconsistent in the seeded data ("OMAX",
   * "SMARTWORLD LOGO", "OBEROI REALITY") and many rows still carry the
   * placeholder "Developer", so {@link partnerForListing} also falls back to
   * the listing title — which always leads with the developer's name.
   */
  aliases?: string[];
};

export const partners: Partner[] = [
  { name: "DLF", image: "/images/logo/1.png" },
  { name: "IREO", image: "/images/logo/12.png" },
  { name: "Reach", image: "/images/logo/13.png" },
  { name: "Signature Global", image: "/images/logo/14.png", aliases: ["signature"] },
  { name: "AIPL", image: "/images/logo/15.png" },
  { name: "Birla Estates", image: "/images/logo/16.png", aliases: ["birla"] },
  { name: "Central Park", image: "/images/logo/17.png" },
  { name: "Suncity Projects", image: "/images/logo/19.png", aliases: ["suncity"] },
  { name: "Paras Buildtech", image: "/images/logo/20.png", aliases: ["paras"] },
  { name: "Sobha", image: "/images/logo/22.png" },
  { name: "Godrej Properties", image: "/images/logo/23.png", aliases: ["godrej"] },
  { name: "Oberoi Realty", image: "/images/logo/24.png", aliases: ["oberoi"] },
  { name: "Adani Realty", image: "/images/logo/adani.png", aliases: ["adani"] },
  { name: "BPTP", image: "/images/logo/BPTP-Logo.png" },
  { name: "Conscient", image: "/images/logo/Conscient-Logo.png" },
  { name: "Elan Group", image: "/images/logo/Elan-Logo.png", aliases: ["elan"] },
  { name: "Emaar", image: "/images/logo/Emaar-Logo-Black.png" },
  { name: "M3M", image: "/images/logo/M3M-Logo.png" },
  { name: "Omaxe", image: "/images/logo/Omaxe-Logo.png", aliases: ["omax"] },
  { name: "Silverglades", image: "/images/logo/silverglades.png" },
  { name: "Smartworld", image: "/images/logo/Smartworld-Logo.png", aliases: ["smart world"] },
  { name: "Vatika", image: "/images/logo/Vatika.png" },
  { name: "Whiteland", image: "/images/logo/Whiteland-Black.png" },
  { name: "ZAK", image: "/images/logo/Zak-Logo.png" },
];

/** Case and punctuation are not reliable in the catalogue, so every comparison
 *  below runs on "dlf the belaire" / "smartworld logo" style text. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * The `?developer=` slug that filters /properties to one partner — the one
 * spelling shared by the homepage marquee and the browser, so a renamed partner
 * cannot leave a link pointing at a filter that no longer resolves.
 */
export function partnerSlug(name: string): string {
  return normalize(name).replace(/ /g, "-");
}

/** The /properties link that lands on this partner's listings. */
export function partnerHref(partner: Partner): string {
  return `/properties?developer=${partnerSlug(partner.name)}`;
}

/** Resolves `?developer=` back to the partner. Undefined for a missing or
 *  unrecognised slug, which shows everything. */
export function partnerFromSlug(slug: string | null | undefined): Partner | undefined {
  if (!slug) return undefined;
  return partners.find((partner) => partnerSlug(partner.name) === slug);
}

function spellings(partner: Partner): string[] {
  return [normalize(partner.name), ...(partner.aliases ?? []).map(normalize)];
}

/** Whole-word containment. Plain `includes` would hand Whiteland's listings to
 *  Elan Group, because "whiteland" has "elan" inside it. */
function hasWord(haystack: string, word: string): boolean {
  return haystack === word || ` ${haystack} `.includes(` ${word} `);
}

/**
 * The partner a listing belongs to, matched on its developer name first and its
 * title second — "DLF The Belaire" is a DLF project whether or not its
 * `developer` column says so.
 *
 * The title is only matched as a leading word so a partner cannot claim a
 * listing that merely mentions it further along.
 */
export function partnerForListing(listing: {
  title: string;
  developer?: string | null;
}): Partner | undefined {
  const developer = listing.developer ? normalize(listing.developer) : "";
  const title = normalize(listing.title);

  return partners.find((partner) =>
    spellings(partner).some(
      (spelling) =>
        (developer !== "" && hasWord(developer, spelling)) ||
        title === spelling ||
        title.startsWith(`${spelling} `)
    )
  );
}
