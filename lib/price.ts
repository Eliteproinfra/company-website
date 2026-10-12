/**
 * Reading the free-text prices listings carry ("₹ 3.22 - 11.21 Cr", "4CR ONWARDS",
 * "₹95.05 Lakh*", "Price On Request") and the budget a visitor types.
 */

const CRORE = 10_000_000;
const LAKH = 100_000;

function unitIn(text: string): number | undefined {
  if (/cr/i.test(text)) return CRORE;
  if (/lakh|lac|\d\s*l\b/i.test(text)) return LAKH;
  return undefined;
}

/**
 * A listing's starting price in rupees — the first figure of a range. Undefined
 * when the listing states no figure ("On Request").
 */
export function priceInRupees(price: string): number | undefined {
  const match = price.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const amount = parseFloat(match[0]);
  // A bare figure is already rupees; every unit-less price in the catalogue so
  // far is "On Request", which never reaches here.
  return Math.round(amount * (unitIn(price) ?? 1));
}

/**
 * What a visitor typed into the Budget box, in rupees: "5 Cr", "2.5 crore",
 * "50 lakh", "80L", "25000000". A bare small number is read as crore, the unit
 * nearly every listing is priced in. Undefined when there is no figure in it.
 */
export function parseBudget(input: string): number | undefined {
  const match = input.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const amount = parseFloat(match[0]);
  if (amount <= 0) return undefined;
  const unit = unitIn(input);
  if (unit) return Math.round(amount * unit);
  return Math.round(amount < 1000 ? amount * CRORE : amount);
}
