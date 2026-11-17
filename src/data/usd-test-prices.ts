/**
 * USD test prices for the current photo assortment, in integer cents, keyed by exact product slug.
 * This object stays empty until the 48-row research CSV is applied. Do not insert estimates,
 * supplier FOB, CNY amounts, or prices from an older SKU list.
 */
export const usdTestPricesCents: Readonly<Record<string, number>> = {};
