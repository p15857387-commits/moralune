import { describe, expect, it } from "vitest";
import { localize, snapshotSelection } from "./catalog";

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

  it("marks missing and unavailable products", () => {
    const products = [{ id: "p1", slug: "tray", name: { "zh-CN": "木托盘", en: "Tray" }, price: 199, available: false }];
    expect(snapshotSelection([{ productId: "p1", quantity: 1 }, { productId: "gone", quantity: 1 }], products, "zh-CN").unavailableIds).toEqual(["p1", "gone"]);
  });
});
