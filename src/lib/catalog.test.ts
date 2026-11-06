import { describe, expect, it } from "vitest";
import { categories } from "@/data/catalog";
import { displayName, formatListedPrice, isPreviewListedProduct, isPurchasable, isPublicCatalogProduct, localize, productsForShop, snapshotSelection, sortCategories } from "./catalog";

describe("catalog", () => {
  it("localizes content and falls back when a locale is blank", () => {
    expect(localize({ "zh-CN": "囿物", en: "YOUWU" }, "en")).toBe("YOUWU");
    expect(localize({ "zh-CN": "囿物", en: "" }, "en")).toBe("囿物");
    expect(localize({ "zh-CN": "", en: "Terra Hand-Tufted Wool Rug - Sand" }, "zh-CN")).toBe("Terra Hand-Tufted Wool Rug - Sand");
    expect(displayName({ "zh-CN": "", en: "Terra Hand-Tufted Wool Rug - Sand" }, "zh-CN")).toBe("Terra Hand-Tufted Wool Rug - Sand");
  });

  it("rebuilds selection snapshots from trusted catalog prices", () => {
    const products = [{ id: "p1", slug: "tray", name: { "zh-CN": "木托盘", en: "Tray" }, price: 199, available: true }];
    expect(snapshotSelection([{ productId: "p1", quantity: 2 }], products, "en")).toEqual({
      items: [{ productId: "p1", slug: "tray", name: "Tray", unitPrice: 199, quantity: 2, lineTotal: 398 }],
      total: 398,
      unavailableIds: [],
    });
  });

  it("sentence-cases English product names and keeps Chinese as written", () => {
    const name = { "zh-CN": "山岚胡桃木托盘", en: "Mist Walnut Landing Tray" };
    expect(displayName(name, "en")).toBe("Mist walnut landing tray");
    expect(displayName(name, "zh-CN")).toBe("山岚胡桃木托盘");
  });

  it("orders the five shop categories and names objects without the old storage label", () => {
    expect(sortCategories(categories).map((category) => category.slug)).toEqual([
      "art-rugs",
      "cushions-throws",
      "wall-art",
      "artful-storage",
      "decorative-lighting",
    ]);
    expect(categories.find((category) => category.slug === "artful-storage")?.name).toEqual({ "zh-CN": "器物", en: "Objects" });
    expect(JSON.stringify(categories)).not.toContain("收纳艺术");
  });

  it("marks missing and unavailable products", () => {
    const products = [{ id: "p1", slug: "tray", name: { "zh-CN": "木托盘", en: "Tray" }, price: 199, available: false }];
    expect(snapshotSelection([{ productId: "p1", quantity: 1 }, { productId: "gone", quantity: 1 }], products, "zh-CN").unavailableIds).toEqual(["p1", "gone"]);
  });

  it("refuses drafts, do-not-list rows, and zero prices", () => {
    const name = { "zh-CN": "", en: "Draft rug" };
    const draft = { id: "RUG-TERRA-01", slug: "rug-terra-01", name, price: 480, available: true, status: "draft" as const, published: false };
    const offAssortment = { id: "WAL-LOOM-01", slug: "wal-loom-01", name, price: 68, available: true, listingRecommendation: "do-not-list" as const, offAssortment: true };
    const unpriced = { id: "free", slug: "free", name, price: 0, available: true };
    expect(isPublicCatalogProduct(draft)).toBe(false);
    expect(isPurchasable(draft)).toBe(false);
    expect(isPurchasable(offAssortment)).toBe(false);
    expect(isPurchasable(unpriced)).toBe(false);
    expect(snapshotSelection(
      [draft, offAssortment, unpriced].map((product) => ({ productId: product.id, quantity: 1 })),
      [draft, offAssortment, unpriced],
      "en",
    ).unavailableIds).toEqual(["RUG-TERRA-01", "WAL-LOOM-01", "free"]);
    expect(formatListedPrice(draft, "en")).toBeUndefined();
    expect(formatListedPrice(unpriced, "en")).toBeUndefined();
  });

  it("shows preview drafts and prefers them on a category page", () => {
    const name = { "zh-CN": "", en: "Draft rug" };
    const draft = { id: "RUG-1", slug: "rug-1", name, price: 0, available: false, category: "art-rugs", status: "draft" as const, published: false };
    const hidden = { id: "WAL-LOOM-01", slug: "wal", name, price: 0, available: false, category: "wall-art", status: "draft" as const, published: false, offAssortment: true, listingRecommendation: "do-not-list" as const };
    const demo = { id: "indigo", slug: "indigo", name: { "zh-CN": "靛", en: "Indigo" }, price: 10, available: true, category: "art-rugs" };
    expect(isPreviewListedProduct(draft)).toBe(true);
    expect(isPreviewListedProduct(hidden)).toBe(false);
    expect(isPublicCatalogProduct(draft)).toBe(false);
    expect(productsForShop([demo, hidden, draft], "art-rugs").map((item) => item.id)).toEqual(["RUG-1"]);
    expect(productsForShop([demo, hidden, draft]).map((item) => item.id)).toEqual(["RUG-1", "indigo"]);
    expect(productsForShop([{ ...demo, category: "wall-art" }], "wall-art").map((item) => item.id)).toEqual(["indigo"]);
  });
});
