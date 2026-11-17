import { usdTestPricesCents } from "@/data/usd-test-prices";

/** Visible on the shop list and PDP in both locales. Not a sell price. */
export const USD_TEST_PRICE_LABEL = "USD TEST PRICE";

/** Largest accepted test amount: $100,000.00. */
export const MAX_USD_TEST_CENTS = 10_000_000;

export type UsdTestPrice = {
  currency: "USD";
  /** Positive integer cents. Absent until the research CSV is applied. */
  cents: number;
  label: typeof USD_TEST_PRICE_LABEL;
};

export function isUsdTestPriceCents(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= MAX_USD_TEST_CENTS;
}

/**
 * The slug table is the only catalog source. A matching key always wins, including
 * an invalid value, which stays hidden. Products omit the field until that table is filled.
 */
export function resolveUsdTestPriceCents(
  product: { slug?: string; usdTestPriceCents?: number },
  table: Readonly<Record<string, number>> = usdTestPricesCents,
): number | undefined {
  if (product.slug && Object.prototype.hasOwnProperty.call(table, product.slug)) {
    return isUsdTestPriceCents(table[product.slug]) ? table[product.slug] : undefined;
  }
  return isUsdTestPriceCents(product.usdTestPriceCents) ? product.usdTestPriceCents : undefined;
}

/** Same string in English and Chinese: `USD TEST PRICE $48.00`. */
export function formatUsdTestPriceCents(cents: number): string | undefined {
  if (!isUsdTestPriceCents(cents)) return undefined;
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return `${USD_TEST_PRICE_LABEL} ${amount}`;
}

export function formatUsdTestPriceQuantity(cents: number, quantity: number): string | undefined {
  if (!isUsdTestPriceCents(cents) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return undefined;
  const total = cents * quantity;
  if (total > MAX_USD_TEST_CENTS * 20) return undefined;
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total / 100);
  return `${USD_TEST_PRICE_LABEL} ${amount}`;
}
