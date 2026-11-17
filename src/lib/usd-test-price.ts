import { usdTestPricedUnits, usdTestPricesCents } from "@/data/usd-test-prices";
import type { Locale } from "@/types";

/** English shop, PDP, and selection label. Not a sell price. */
export const USD_TEST_PRICE_LABEL = "USD TEST PRICE";
/** Chinese shop, PDP, and selection label. Not a sell price. */
export const USD_TEST_PRICE_LABEL_ZH = "美元测试价";

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

export function usdTestPriceLabel(locale: Locale): string {
  return locale === "zh-CN" ? USD_TEST_PRICE_LABEL_ZH : USD_TEST_PRICE_LABEL;
}

function usdAmount(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** `USD TEST PRICE $48.00` in English, `美元测试价 $48.00` in Chinese. */
export function formatUsdTestPriceCents(cents: number, locale: Locale): string | undefined {
  if (!isUsdTestPriceCents(cents)) return undefined;
  return `${usdTestPriceLabel(locale)} ${usdAmount(cents)}`;
}

export function formatUsdTestPriceQuantity(cents: number, quantity: number, locale: Locale): string | undefined {
  if (!isUsdTestPriceCents(cents) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return undefined;
  const total = cents * quantity;
  if (total > MAX_USD_TEST_CENTS * 20) return undefined;
  return `${usdTestPriceLabel(locale)} ${usdAmount(total)}`;
}

/** The CSV unit, labeled as a testing assumption. Not a material, size, or confirmed package. */
export function formatUsdTestUnitNote(slug: string | undefined, locale: Locale): string | undefined {
  if (!slug || !Object.prototype.hasOwnProperty.call(usdTestPricedUnits, slug)) return undefined;
  const unit = usdTestPricedUnits[slug];
  if (!unit) return undefined;
  return locale === "zh-CN"
    ? `测试假设，不是已确认的包装内容：${unit}`
    : `Testing assumption, not confirmed package contents: ${unit}`;
}
