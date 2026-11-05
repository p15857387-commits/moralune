import { describe, expect, it, vi } from "vitest";
import { buildShopifyCartLines, createShopifyCart, shopifyCheckoutSchema } from "./shopify";
import type { Product } from "@/types";

const product = (overrides: Partial<Product> = {}): Product => ({
  id: "walnut-tray",
  slug: "walnut-catchall-tray",
  name: { "zh-CN": "山岚胡桃木托盘", en: "Mist Walnut Catchall" },
  price: 268,
  available: true,
  shopifyVariantId: "gid://shopify/ProductVariant/1001",
  ...overrides,
});

describe("shopify checkout", () => {
  it("accepts product ids and bounded quantities", () => {
    expect(shopifyCheckoutSchema.parse({ items: [{ productId: "walnut-tray", quantity: 2 }] })).toEqual({
      items: [{ productId: "walnut-tray", quantity: 2 }],
    });

    expect(shopifyCheckoutSchema.safeParse({ items: [{ productId: "walnut-tray", quantity: 21 }] }).success).toBe(false);
  });

  it("builds cart lines from trusted available products with Shopify variant ids", () => {
    expect(buildShopifyCartLines([{ productId: "walnut-tray", quantity: 2 }], [product()])).toEqual({
      lines: [{ merchandiseId: "gid://shopify/ProductVariant/1001", quantity: 2 }],
      unavailableIds: [],
      unmappedIds: [],
    });
  });

  it("rejects unavailable or unmapped products before calling Shopify", () => {
    expect(buildShopifyCartLines([
      { productId: "unavailable", quantity: 1 },
      { productId: "unmapped", quantity: 1 },
      { productId: "missing", quantity: 1 },
    ], [
      product({ id: "unavailable", available: false }),
      product({ id: "unmapped", shopifyVariantId: "" }),
    ])).toEqual({
      lines: [],
      unavailableIds: ["unavailable", "missing"],
      unmappedIds: ["unmapped"],
    });
  });

  it("creates a Shopify cart and returns the checkout URL", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { cartCreate: { cart: { checkoutUrl: "https://shop.example/checkouts/cn/abc" }, userErrors: [] } },
      }),
    });

    await expect(createShopifyCart({
      storeDomain: "youwu.myshopify.com",
      accessToken: "storefront-token",
      apiVersion: "2026-01",
      lines: [{ merchandiseId: "gid://shopify/ProductVariant/1001", quantity: 2 }],
      fetcher,
    })).resolves.toEqual({ checkoutUrl: "https://shop.example/checkouts/cn/abc" });

    expect(fetcher).toHaveBeenCalledWith("https://youwu.myshopify.com/api/2026-01/graphql.json", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ "X-Shopify-Storefront-Access-Token": "storefront-token" }),
    }));
  });

  it("surfaces Shopify user errors", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { cartCreate: { cart: null, userErrors: [{ message: "Variant is not available" }] } },
      }),
    });

    await expect(createShopifyCart({
      storeDomain: "youwu.myshopify.com",
      accessToken: "storefront-token",
      apiVersion: "2026-01",
      lines: [{ merchandiseId: "gid://shopify/ProductVariant/1001", quantity: 1 }],
      fetcher,
    })).rejects.toThrow("Variant is not available");
  });
});
