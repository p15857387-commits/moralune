import { describe, expect, it } from "vitest";
import { products } from "@/data/catalog";
import { usdTestPricesCents } from "@/data/usd-test-prices";
import { formatListedPrice, isPurchasable } from "@/lib/catalog";
import {
  formatUsdTestPriceCents,
  formatUsdTestPriceQuantity,
  isUsdTestPriceCents,
  resolveUsdTestPriceCents,
} from "@/lib/usd-test-price";

describe("USD test prices", () => {
  it("keeps the price table empty and leaves every current product unpriced", () => {
    expect(usdTestPricesCents).toEqual({});
    expect(products).toHaveLength(48);
    for (const product of products) {
      expect(product.price).toBe(0);
      expect(product.usdTestPriceCents).toBeUndefined();
      expect(resolveUsdTestPriceCents(product)).toBeUndefined();
      expect(formatListedPrice(product, "en")).toBeUndefined();
      expect(formatListedPrice(product, "zh-CN")).toBeUndefined();
      expect(isPurchasable({ ...product, usdTestPriceCents: 4800, available: true })).toBe(false);
    }
  });

  it("prints one explicit USD test label for both locales and never a CNY amount", () => {
    const draft = {
      slug: "rug-organic-01",
      price: 199,
      status: "draft" as const,
      published: false,
      usdTestPriceCents: 4800,
    };
    expect(formatUsdTestPriceCents(4800)).toBe("USD TEST PRICE $48.00");
    expect(formatListedPrice(draft, "en")).toBe("USD TEST PRICE $48.00");
    expect(formatListedPrice(draft, "zh-CN")).toBe("USD TEST PRICE $48.00");
    expect(formatUsdTestPriceQuantity(4800, 2)).toBe("USD TEST PRICE $96.00");
    expect(formatListedPrice({ ...draft, usdTestPriceCents: undefined }, "en")).toBeUndefined();
    expect(formatListedPrice({ price: 199, status: "published" as const, published: true }, "zh-CN")).toBeUndefined();
    expect(formatListedPrice(draft, "zh-CN")).not.toMatch(/CNY|¥|人民币/);
  });

  it("accepts only a positive integer cent amount from the slug table", () => {
    expect(isUsdTestPriceCents(4800)).toBe(true);
    expect(isUsdTestPriceCents(0)).toBe(false);
    expect(isUsdTestPriceCents(12.5)).toBe(false);
    expect(isUsdTestPriceCents(-100)).toBe(false);
    expect(resolveUsdTestPriceCents({ slug: "rug-organic-01" }, { "rug-organic-01": 1250 })).toBe(1250);
    expect(resolveUsdTestPriceCents({ slug: "rug-organic-01", usdTestPriceCents: 9900 }, { "rug-organic-01": 12.5 })).toBeUndefined();
    expect(resolveUsdTestPriceCents({ slug: "other", usdTestPriceCents: 2500 }, {})).toBe(2500);
  });
});
