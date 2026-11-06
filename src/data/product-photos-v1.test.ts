import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { productMasterDrafts, productMasterV1 } from "./product-master-v1";
import { chooseProductPhotos, excludedPhotoFiles, productPhotosBySku, type PhotoFile } from "./product-photos-v1";

const terra = "RUG-TERRA-01-SND-160x230";

describe("product photos v1", () => {
  it("never shows the mismatched terra frames, even when a plan asks for them", () => {
    const files: PhotoFile[] = [
      { sku: terra, filename: "main-01.jpg", watermark: "no" },
      { sku: terra, filename: "detail-01.webp", watermark: "suspected" },
      { sku: terra, filename: "detail-05.webp", watermark: "suspected" },
    ];
    const chosen = chooseProductPhotos(terra, files, {
      sku: terra,
      hero: "detail-01.webp",
      gallery: ["detail-01.webp", "main-01.jpg", "detail-05.webp"],
    });
    expect(chosen).toEqual([]);
    expect(excludedPhotoFiles[terra]).toContain("main-01.jpg");
    expect(productPhotosBySku[terra]).toEqual([]);
    for (const filename of excludedPhotoFiles[terra] ?? []) {
      expect(existsSync(resolve("public/products/v1", terra, filename))).toBe(true);
    }
  });

  it("prefers a clean frame over a watermarked hero", () => {
    const sku = "OBJ-EXAMPLE";
    const chosen = chooseProductPhotos(sku, [
      { sku, filename: "main-01.jpg", watermark: "yes" },
      { sku, filename: "detail-01.webp", watermark: "suspected" },
      { sku, filename: "detail-02.webp", watermark: "no" },
    ], { sku, hero: "main-01.jpg", hero_wm: "yes", gallery: ["main-01.jpg", "detail-01.webp"] });
    expect(chosen[0]?.filename).toBe("detail-02.webp");
    expect(chosen.map((image) => image.filename)).not.toContain("main-01.jpg");
    expect(chosen.every((image) => image.watermark !== "yes")).toBe(true);
  });

  it("attaches a swappable gallery for every master SKU", () => {
    expect(Object.keys(productPhotosBySku)).toHaveLength(50);
    const watermarkedHeroes = [];
    for (const record of productMasterV1) {
      const images = productPhotosBySku[record.sku];
      if (record.sku === terra) {
        expect(images).toEqual([]);
        continue;
      }
      expect(images?.length).toBeGreaterThan(0);
      const hero = images?.[0];
      expect(hero?.role).toBe("hero");
      expect(hero?.src).toBe(`/products/v1/${record.sku}/${hero?.filename}`);
      for (const image of images ?? []) {
        expect(image.src.startsWith(`/products/v1/${record.sku}/`)).toBe(true);
        expect(existsSync(resolve("public", image.src.slice(1)))).toBe(true);
        if (hero?.watermark !== "yes") expect(image.watermark).not.toBe("yes");
      }
      if (hero?.watermark === "yes") watermarkedHeroes.push(record.sku);
      const draft = productMasterDrafts.find((item) => item.id === record.sku);
      expect(draft?.image).toBe(hero?.src);
      expect(draft?.images).toEqual(images);
    }
    expect(watermarkedHeroes).toEqual(["THR-WAFL-01-SND-130x170"]);
  });
});
