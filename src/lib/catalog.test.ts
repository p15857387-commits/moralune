import { describe, expect, it } from "vitest";
import { categories } from "@/data/catalog";
import { displayName, localize, snapshotSelection, sortCategories } from "./catalog";

describe("catalog", () => {
  it("localizes content and falls back to Chinese", () => {
    expect(localize({ "zh-CN": "囿物", en: "YOUWU" }, "en")).toBe("YOUWU");
    expect(localize({ "zh-CN": "囿物", en: "" }, "en")).toBe("囿物");
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
});
