import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { photoAssortmentV2 } from "./photo-assortment-v2";
import { canonicalProductSlug, redirectCategorySlug } from "@/lib/legacy-routes";

describe("photo assortment v2", () => {
  it("groups every frame by its folder and lists the shared pair only as lamps", () => {
    const counts = Object.fromEntries(["rugs", "cushions", "wall-hangings", "objects", "lamps"].map((slug) => [
      slug,
      photoAssortmentV2.filter((product) => product.category === slug).length,
    ]));
    expect(counts).toEqual({ rugs: 8, cushions: 8, "wall-hangings": 8, objects: 11, lamps: 8 });
    expect(photoAssortmentV2.filter((product) => product.id === "img-3581" || product.id === "img-3582").map((product) => product.category)).toEqual(["lamps", "lamps"]);
    const ids = photoAssortmentV2.map((product) => product.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const product of photoAssortmentV2) {
      expect(product.price).toBe(0);
      expect(product.available).toBe(false);
      expect(product.status).toBe("draft");
      expect(product.material).toBeUndefined();
      expect(product.image).toBe(`/products/v2/${product.category}/${product.images?.[0]?.filename}`);
      expect(existsSync(resolve("public", product.image!.slice(1)))).toBe(true);
      expect(JSON.stringify(product)).not.toMatch(/SGS|OEKO-TEX|certified|其他杂项/i);
    }
  });

  it("redirects old category slugs and short camera ids", () => {
    expect(redirectCategorySlug("art-rugs")).toBe("rugs");
    expect(redirectCategorySlug("cushions-throws")).toBe("cushions");
    expect(redirectCategorySlug("wall-art")).toBe("wall-hangings");
    expect(redirectCategorySlug("artful-storage")).toBe("objects");
    expect(redirectCategorySlug("decorative-lighting")).toBe("lamps");
    expect(canonicalProductSlug("3545")).toBe("img-3545");
    expect(canonicalProductSlug("IMG_3581")).toBe("img-3581");
    expect(canonicalProductSlug("img-3545")).toBeUndefined();
  });
});
