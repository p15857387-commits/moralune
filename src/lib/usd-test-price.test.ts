import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { products } from "@/data/catalog";
import { usdTestPricedUnits, usdTestPricesCents } from "@/data/usd-test-prices";
import { paypalPriceMap } from "@/lib/env";
import { formatListedPrice, isPurchasable } from "@/lib/catalog";
import {
  formatUsdTestPriceCents,
  formatUsdTestPriceQuantity,
  formatUsdTestUnitNote,
  isUsdTestPriceCents,
  resolveUsdTestPriceCents,
} from "@/lib/usd-test-price";

function csvRows() {
  const lines = readFileSync("src/data/website-usd-test-prices.csv", "utf8").trim().split(/\r?\n/);
  const [header, ...body] = lines;
  expect(header).toBe("slug,currency,test_price_usd,priced_unit");
  return body.map((line) => {
    const [slug, currency, dollars, ...unit] = line.split(",");
    return { slug, currency, cents: Number(dollars) * 100, unit: unit.join(",") };
  });
}

describe("USD test prices", () => {
  it("applies each CSV slug once and leaves sale price, checkout, and specs untouched", () => {
    const rows = csvRows();
    expect(rows).toHaveLength(48);
    expect(new Set(rows.map((row) => row.slug)).size).toBe(48);
    expect(Object.keys(usdTestPricesCents).sort()).toEqual(products.map((product) => product.slug).sort());
    expect(Object.keys(usdTestPricedUnits).sort()).toEqual(Object.keys(usdTestPricesCents).sort());
    for (const row of rows) {
      expect(row.currency).toBe("USD");
      expect(usdTestPricesCents[row.slug]).toBe(row.cents);
      expect(usdTestPricedUnits[row.slug]).toBe(row.unit);
      expect(paypalPriceMap[row.slug]).toBeUndefined();
    }
    expect(usdTestPricedUnits["img-3542"]).toBe("XO set of two letter cushions");
    for (const product of products) {
      expect(product.price).toBe(0);
      expect(product.material).toBeUndefined();
      expect(product.dimensions).toBeUndefined();
      expect(product.status).toBe("draft");
      expect(resolveUsdTestPriceCents(product)).toBe(usdTestPricesCents[product.slug]);
      expect(isPurchasable({ ...product, available: true })).toBe(false);
      const cents = usdTestPricesCents[product.slug];
      const dollars = (cents / 100).toFixed(2);
      expect(formatListedPrice(product, "en")).toBe(`USD TEST PRICE $${dollars}`);
      expect(formatListedPrice(product, "zh-CN")).toBe(`美元测试价 $${dollars}`);
      expect(formatUsdTestUnitNote(product.slug, "en")).toBe(`Testing assumption, not confirmed package contents: ${usdTestPricedUnits[product.slug]}`);
      expect(formatUsdTestUnitNote(product.slug, "zh-CN")).toContain("测试假设，不是已确认的包装内容：");
      expect(JSON.stringify(product)).not.toMatch(/5\s*x\s*8|circa/i);
    }
  });

  it("prints locale labels for a sample amount and never a CNY amount", () => {
    const draft = {
      slug: "sample-draft",
      price: 199,
      status: "draft" as const,
      published: false,
      usdTestPriceCents: 4800,
    };
    expect(formatUsdTestPriceCents(4800, "en")).toBe("USD TEST PRICE $48.00");
    expect(formatUsdTestPriceCents(4800, "zh-CN")).toBe("美元测试价 $48.00");
    expect(formatListedPrice(draft, "en")).toBe("USD TEST PRICE $48.00");
    expect(formatListedPrice(draft, "zh-CN")).toBe("美元测试价 $48.00");
    expect(formatUsdTestPriceQuantity(4800, 2, "en")).toBe("USD TEST PRICE $96.00");
    expect(formatUsdTestPriceQuantity(4800, 2, "zh-CN")).toBe("美元测试价 $96.00");
    expect(formatListedPrice({ price: 199 }, "zh-CN")).toBeUndefined();
    expect(formatListedPrice(draft, "zh-CN")).not.toMatch(/CNY|¥/);
    expect(isUsdTestPriceCents(12.5)).toBe(false);
    expect(resolveUsdTestPriceCents({ slug: "rug-organic-01", usdTestPriceCents: 9900 }, { "rug-organic-01": 12.5 })).toBeUndefined();
  });
});
