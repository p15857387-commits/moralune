import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "./catalog";
import { roomLooks } from "./looks";

describe("room looks", () => {
  it("uses real catalog products and image files, with video optional", () => {
    const ids = new Set(products.map((product) => product.id));
    expect(roomLooks.length).toBeGreaterThanOrEqual(3);
    for (const look of roomLooks) {
      expect(look.productIds.length).toBeGreaterThan(0);
      expect(look.poster.startsWith("/images/")).toBe(true);
      expect(existsSync(path.join(process.cwd(), "public", look.poster))).toBe(true);
      if (look.videoSrc) expect(look.videoSrc.startsWith("/")).toBe(true);
      for (const id of look.productIds) {
        expect(ids.has(id), id).toBe(true);
        const product = products.find((item) => item.id === id);
        expect(product?.image).toBeTruthy();
        expect(existsSync(path.join(process.cwd(), "public", product!.image!))).toBe(true);
      }
    }
  });
});
