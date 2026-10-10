export type CountryCode = {
  /** ISO 3166-1 alpha-2. Used as the <select> value because +1 covers both US and CA. */
  iso: string;
  /** Short label shown in the dropdown, e.g. "IND". */
  short: string;
  name: string;
  dial: string;
  /**
   * How many digits the number itself runs to, once the dial code and any trunk "0" are
   * off the front — the ITU "national significant number" length.
   *
   * Required rather than defaulted, because a single shared range is what this list got
   * wrong: at a flat 10–12 digits every one of the Gulf corridors, Singapore, Hong Kong
   * and most of Europe was rejected out of hand, since their numbers are 8 or 9 digits.
   * Ranges are deliberately a little loose where a country mixes landline and mobile
   * lengths — this is a web form, not a carrier.
   */
  min: number;
  max: number;
};

/** India first (the default), then the NRI corridors the site sells into, then the rest. */
export const countryCodes: CountryCode[] = [
  { iso: "IN", short: "IND", name: "India", dial: "+91", min: 10, max: 10 },
  { iso: "AE", short: "UAE", name: "United Arab Emirates", dial: "+971", min: 8, max: 9 },
  { iso: "US", short: "USA", name: "United States", dial: "+1", min: 10, max: 10 },
  { iso: "GB", short: "UK", name: "United Kingdom", dial: "+44", min: 9, max: 10 },
  { iso: "SG", short: "SGP", name: "Singapore", dial: "+65", min: 8, max: 8 },
  { iso: "CA", short: "CAN", name: "Canada", dial: "+1", min: 10, max: 10 },
  { iso: "AU", short: "AUS", name: "Australia", dial: "+61", min: 9, max: 9 },
  { iso: "SA", short: "KSA", name: "Saudi Arabia", dial: "+966", min: 9, max: 9 },
  { iso: "QA", short: "QAT", name: "Qatar", dial: "+974", min: 8, max: 8 },
  { iso: "OM", short: "OMN", name: "Oman", dial: "+968", min: 8, max: 8 },
  { iso: "KW", short: "KWT", name: "Kuwait", dial: "+965", min: 8, max: 8 },
  { iso: "BH", short: "BHR", name: "Bahrain", dial: "+973", min: 8, max: 8 },
  { iso: "HK", short: "HKG", name: "Hong Kong", dial: "+852", min: 8, max: 8 },
  { iso: "MY", short: "MYS", name: "Malaysia", dial: "+60", min: 9, max: 10 },
  { iso: "NZ", short: "NZL", name: "New Zealand", dial: "+64", min: 8, max: 10 },
  { iso: "DE", short: "DEU", name: "Germany", dial: "+49", min: 9, max: 11 },
  { iso: "FR", short: "FRA", name: "France", dial: "+33", min: 9, max: 9 },
  { iso: "NL", short: "NLD", name: "Netherlands", dial: "+31", min: 9, max: 9 },
  { iso: "CH", short: "CHE", name: "Switzerland", dial: "+41", min: 9, max: 9 },
  { iso: "IE", short: "IRL", name: "Ireland", dial: "+353", min: 7, max: 9 },
  { iso: "ZA", short: "ZAF", name: "South Africa", dial: "+27", min: 9, max: 9 },
  { iso: "KE", short: "KEN", name: "Kenya", dial: "+254", min: 9, max: 9 },
  { iso: "NG", short: "NGA", name: "Nigeria", dial: "+234", min: 8, max: 10 },
  { iso: "JP", short: "JPN", name: "Japan", dial: "+81", min: 9, max: 10 },
  { iso: "CN", short: "CHN", name: "China", dial: "+86", min: 10, max: 11 },
  { iso: "TH", short: "THA", name: "Thailand", dial: "+66", min: 8, max: 9 },
  { iso: "NP", short: "NPL", name: "Nepal", dial: "+977", min: 8, max: 10 },
  { iso: "LK", short: "LKA", name: "Sri Lanka", dial: "+94", min: 9, max: 9 },
  { iso: "BD", short: "BGD", name: "Bangladesh", dial: "+880", min: 9, max: 10 },
];

export const defaultCountry = countryCodes[0];

/**
 * How many digits the phone input will accept being typed or pasted into it.
 *
 * E.164 caps a full international number at 15 digits, and the field has to hold one of
 * those — somebody pasting "+880 1XXXXXXXXX" is handing it 13 digits before the trunk
 * code and country code come off. Anything narrower truncates the paste and then reports
 * the result as invalid. Deciding whether the number is the right length is
 * {@link validatePhoneNumber}'s job, per country, not the input cap's.
 */
export const PHONE_INPUT_MAX_DIGITS = 15;

export function findCountry(iso: string): CountryCode {
  return countryCodes.find((country) => country.iso === iso) ?? defaultCountry;
}

/** "9" or "8–9" — the digit count to quote back in an error message. */
function expectedDigits(country: CountryCode): string {
  return country.min === country.max ? `${country.min}` : `${country.min}–${country.max}`;
}

export type PhoneCheck = { ok: true; national: string; e164: string } | { ok: false; error: string };

/**
 * Checks a number against the dial code picked in the dropdown. Spaces, dashes, dots and
 * brackets are ignored, a pasted-in copy of the selected dial code is accepted, and a single
 * trunk "0" is dropped — so both "098765 43210" and "+91 98765-43210" pass as an Indian number.
 */
export function validatePhoneNumber(iso: string, input: string): PhoneCheck {
  const country = findCountry(iso);
  const trimmed = input.trim();

  if (!trimmed) return { ok: false, error: "Please enter your phone number." };

  let value = trimmed.replace(/[\s()./-]/g, "");

  if (value.startsWith("+") || value.startsWith("00")) {
    const typed = value.startsWith("+") ? value : `+${value.slice(2)}`;
    if (!typed.startsWith(country.dial)) {
      return {
        ok: false,
        error: `This number starts with a different country code. Pick it from the dropdown, or enter a ${country.dial} number.`,
      };
    }
    value = typed.slice(country.dial.length);
  } else {
    // Dial code pasted without the "+", e.g. "919876543210". Only strip it when what is left
    // is still a full-length number for this country, so a local number that happens to open
    // with the same digits — "9168686868" on +91 — is left alone.
    const bare = country.dial.slice(1);
    if (value.startsWith(bare) && value.length - bare.length >= country.min) {
      value = value.slice(bare.length);
    }
  }

  value = value.replace(/^0+/, "");

  if (!value) {
    return { ok: false, error: `Please enter your number after the ${country.dial} country code.` };
  }

  if (!/^\d+$/.test(value)) {
    return { ok: false, error: "A phone number can only contain digits." };
  }

  if (value.length < country.min || value.length > country.max) {
    return {
      ok: false,
      // Phrased without an article: "A India number" reads wrong, and the country list is
      // a mix of names that would take "a", "an" and none at all.
      error: `${country.name} numbers are ${expectedDigits(country)} digits after ${country.dial}.`,
    };
  }

  return { ok: true, national: value, e164: `${country.dial}${value}` };
}
