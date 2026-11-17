import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { photoAssortmentV2, photoAssortmentV2Leads } from "./photo-assortment-v2";
import files from "./photo-assortment-v2.files.json";
import { productsForShop } from "@/lib/catalog";
import { canonicalProductSlug, redirectCategorySlug } from "@/lib/legacy-routes";

function jpegSize(path: string) {
  const data = readFileSync(path);
  let i = 2;
  while (i < data.length - 8) {
    if (data[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = data[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { width: data.readUInt16BE(i + 7), height: data.readUInt16BE(i + 5), bytes: data.length };
    }
    if (marker === 0xd8 || marker === 0xd9) {
      i += 2;
      continue;
    }
    i += 2 + data.readUInt16BE(i + 2);
  }
  throw new Error(`No JPEG size in ${path}`);
}

describe("photo assortment v2", () => {
  it("groups every frame by its folder and lists the shared pair only as lamps", () => {
    const counts = Object.fromEntries(["rugs", "cushions", "wall-hangings", "objects", "lamps"].map((slug) => [
      slug,
      photoAssortmentV2.filter((product) => product.category === slug).length,
    ]));
    expect(counts).toEqual({ rugs: 9, cushions: 9, "wall-hangings": 9, objects: 12, lamps: 9 });
    expect(photoAssortmentV2).toHaveLength(48);
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

  it("leads each category with one named photo and keeps that file in that folder only", () => {
    const expected = [
      { id: "rug-organic-01", category: "rugs", file: "rug-organic-01.jpg", width: 1200, height: 1200, bytes: 209800 },
      { id: "cushion-sphere-01", category: "cushions", file: "cushion-sphere-01.jpg", width: 1200, height: 1200, bytes: 367257 },
      { id: "wall-clock-01", category: "wall-hangings", file: "wall-clock-01.jpg", width: 441, height: 441, bytes: 35060 },
      { id: "object-footed-bowl-01", category: "objects", file: "object-footed-bowl-01.jpg", width: 1200, height: 1200, bytes: 95896 },
      { id: "lamp-stitched-01", category: "lamps", file: "lamp-stitched-01.jpg", width: 750, height: 1125, bytes: 96229 },
    ];
    expect(photoAssortmentV2Leads.map((product) => product.id)).toEqual(expected.map((item) => item.id));
    for (const item of expected) {
      const matches = photoAssortmentV2.filter((product) => product.image?.endsWith(`/${item.file}`));
      expect(matches.map((product) => product.category)).toEqual([item.category]);
      expect(matches[0]?.id).toBe(item.id);
      expect(matches[0]?.price).toBe(0);
      expect(matches[0]?.material).toBeUndefined();
      expect(matches[0]?.dimensions).toBeUndefined();
      expect(productsForShop(photoAssortmentV2, item.category)[0]?.id).toBe(item.id);
      const path = resolve("public/products/v2", item.category, item.file);
      expect(jpegSize(path)).toEqual({ width: item.width, height: item.height, bytes: item.bytes });
      const copies = readdirSync(resolve("public/products/v2"), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .filter((entry) => existsSync(resolve("public/products/v2", entry.name, item.file)));
      expect(copies.map((entry) => entry.name)).toEqual([item.category]);
    }
    const camera = photoAssortmentV2.filter((product) => product.id.startsWith("img-"));
    expect(camera.map((product) => product.id)).toEqual((files as { id: string }[]).map((row) => row.id));
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
