import { describe, expect, it } from "vitest";
import { listPreviewFallbackProducts } from "@/lib/catalog-source";
import { imageLedHomeEdit, homeCategoryLimit } from "./home-selection";
import type { Product } from "@/types";

const products = listPreviewFallbackProducts();

describe("homepage category edit", () => {
  it("shows six image-led pieces from each photo folder and leaves the rest unpadded", () => {
    expect(imageLedHomeEdit(products, "rugs")).toMatchObject({ eligible: 9, shown: 6, shortfall: 0 });
    expect(imageLedHomeEdit(products, "cushions")).toMatchObject({ eligible: 9, shown: 6, shortfall: 0 });
    expect(imageLedHomeEdit(products, "wall-hangings")).toMatchObject({ eligible: 9, shown: 6, shortfall: 0 });
    expect(imageLedHomeEdit(products, "objects")).toMatchObject({ eligible: 12, shown: 6, shortfall: 0 });
    expect(imageLedHomeEdit(products, "lamps")).toMatchObject({ eligible: 9, shown: 6, shortfall: 0 });
    const leads: Record<string, string> = {
      rugs: "rug-organic-01",
      cushions: "cushion-sphere-01",
      "wall-hangings": "wall-clock-01",
      objects: "object-footed-bowl-01",
      lamps: "lamp-stitched-01",
    };
    for (const slug of Object.keys(leads)) {
      const items = imageLedHomeEdit(products, slug).items;
      expect(items[0]?.id).toBe(leads[slug]);
      for (const item of items) {
        expect(item.image).toContain(`/products/v2/${slug}/`);
      }
    }
  });

  it("keeps the shared lamp frames out of objects and does not repeat a photo", () => {
    const shown = ["rugs", "cushions", "wall-hangings", "objects", "lamps"]
      .flatMap((slug) => imageLedHomeEdit(products, slug).items.map((item) => item.id));
    expect(imageLedHomeEdit(products, "objects").items.some((item) => item.id === "img-3581" || item.id === "img-3582")).toBe(false);
    expect(new Set(shown).size).toBe(shown.length);
  });

  it("does not pad a short category and still refuses a mismatched photo path", () => {
    const name = { "zh-CN": "", en: "Piece" };
    const base = { name, price: 0, available: false, category: "art-rugs", status: "draft" as const, published: false };
    const terra = { ...base, id: "RUG-TERRA-01-SND-160x230", slug: "terra", image: "/products/v1/RUG-TERRA-01-SND-160x230/detail-01.webp" };
    const loom = { ...base, id: "WAL-LOOM-01-NAT-68x40", slug: "loom", category: "wall-art", image: "/products/v1/WAL-LOOM-01-NAT-68x40/main-01.jpg", offAssortment: true, listingRecommendation: "do-not-list" as const };
    const one = { ...base, id: "RUG-SAHL-01-NAT-160x230", slug: "sahl", image: "/products/v1/RUG-SAHL-01-NAT-160x230/main-01.jpg" };
    const edit = imageLedHomeEdit([terra, one, one, loom] as Product[], "art-rugs");
    expect(edit.items.map((item) => item.id)).toEqual(["RUG-SAHL-01-NAT-160x230"]);
    expect(edit.eligible).toBe(1);
    expect(edit.shown).toBe(1);
    expect(edit.shortfall).toBe(homeCategoryLimit - 1);
    expect(imageLedHomeEdit([loom] as Product[], "wall-art").items).toEqual([]);
  });
});
