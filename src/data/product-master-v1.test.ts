import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/data/catalog";
import { paypalPriceMap } from "@/lib/env";
import { formatListedPrice, isPreviewListedProduct, isPublicCatalogProduct, isPurchasable, productsForShop } from "@/lib/catalog";
import { getCatalog, listPublicFallbackProducts } from "@/lib/catalog-source";
import {
  DO_NOT_LIST_SKUS,
  US_READY_SKU,
  isUnknownMasterValue,
  productMasterDrafts,
  productMasterV1,
} from "./product-master-v1";

const internalKeys = [
  "supplier", "supplierType", "sourceUrl", "fobUnitEstUsd", "suggestedRetailUsdEst",
  "impliedGrossMarginEst", "listedPrice", "moq", "complianceNotes", "certificationsStated",
  "brandFitFlag", "usReady", "productNameSource",
];

describe("product master v1", () => {
  it("imports every CSV row once and skips none", () => {
    const csv = readFileSync(resolve(process.cwd(), "src/data/product-master-v1.csv"), "utf8").replace(/^\uFEFF/, "");
    const lines = csv.trim().split(/\r?\n/);
    expect(lines).toHaveLength(51);
    expect(productMasterV1).toHaveLength(50);
    expect(productMasterDrafts).toHaveLength(50);
    expect(new Set(productMasterV1.map((record) => record.sku)).size).toBe(50);
    for (const record of productMasterV1) expect(csv).toContain(record.sku);
    expect(productMasterV1.filter((record) => record.categoryCode === "RUG")).toHaveLength(10);
    expect(productMasterV1.filter((record) => record.categoryCode === "CSH")).toHaveLength(6);
    expect(productMasterV1.filter((record) => record.categoryCode === "THR")).toHaveLength(4);
    expect(productMasterV1.filter((record) => record.categoryCode === "WAL")).toHaveLength(10);
    expect(productMasterV1.filter((record) => record.categoryCode === "OBJ")).toHaveLength(10);
    expect(productMasterV1.filter((record) => record.categoryCode === "LGT")).toHaveLength(10);
  });

  it("keeps every imported SKU draft, unpublished, and not purchasable", () => {
    for (const draft of productMasterDrafts) {
      expect(draft.status).toBe("draft");
      expect(draft.published).toBe(false);
      expect(draft.available).toBe(false);
      expect(draft.featured).toBe(false);
      expect(draft.price).toBe(0);
      expect(draft.shopifyVariantId).toBeUndefined();
      expect(draft.shoppaasBuyUrl).toBeUndefined();
      if (draft.id === "RUG-TERRA-01-SND-160x230") {
        expect(draft.image).toBeUndefined();
        expect(draft.images).toEqual([]);
      } else {
        expect(draft.image).toMatch(/^\/products\/v1\//);
        expect(draft.images?.[0]?.src).toBe(draft.image);
        expect(draft.images?.[0]?.role).toBe("hero");
      }
      expect(draft.name["zh-CN"]).toBe("");
      expect(draft.name.en.length).toBeGreaterThan(0);
      expect(draft.description?.en.length).toBeGreaterThan(0);
      expect(isPublicCatalogProduct(draft)).toBe(false);
      expect(isPreviewListedProduct(draft)).toBe(!draft.offAssortment);
      expect(isPurchasable(draft)).toBe(false);
      expect(formatListedPrice(draft, "en")).toBeUndefined();
      expect(JSON.stringify(draft)).not.toMatch(/\b(SGS|OEKO-TEX|certified)\b/i);
      for (const key of internalKeys) expect(draft).not.toHaveProperty(key);
    }
  });

  it("does not copy estimates or unknown prices into a sell price", () => {
    const unknownPrice = productMasterV1.filter((record) => isUnknownMasterValue(record.fobUnitEstUsd) || isUnknownMasterValue(record.listedPrice));
    expect(unknownPrice.map((record) => record.sku)).toEqual([
      "CSH-VELA-01-RST-45x45",
      "CSH-VELA-02-OLV-45x45",
      "CSH-BOUC-01-IVR-45x45",
      "CSH-BOUC-02-OAT-30x50",
      "CSH-WEAV-01-SND-45x45",
      "CSH-LINO-01-NAT-45x45",
      "THR-LINO-03-CLY-120x150",
      "OBJ-KILN-06-GRN-D15xH20",
      "LGT-PLIS-01-RED-STD-US",
      "LGT-ORLA-04-NAT-D35xH40-US",
      "LGT-PLIS-03-GRN-STD-US",
    ]);
    for (const record of unknownPrice) {
      expect(record.fobUnitEstUsd === "unknown" || record.listedPrice.toLowerCase().includes("not usable") || record.listedPrice.toLowerCase().startsWith("unknown")).toBe(true);
      expect(record.impliedGrossMarginEst).toBe("unknown");
      expect(productMasterDrafts.find((draft) => draft.id === record.sku)?.price).toBe(0);
    }
    for (const record of productMasterV1) {
      expect(record.suggestedRetailUsdEst.startsWith("EST ")).toBe(true);
      expect(paypalPriceMap[record.sku]).toBeUndefined();
    }
    const cushion = productMasterV1.find((record) => record.sku === "CSH-VELA-01-RST-45x45");
    expect(cushion?.suggestedRetailUsdEst).toBe("EST 38-58");
    expect(cushion?.fobUnitEstUsd).toBe("unknown");
    const placeholder = productMasterV1.find((record) => record.sku === "LGT-PLIS-01-RED-STD-US");
    expect(placeholder?.listedPrice).toContain("not usable");
    expect(placeholder?.fobUnitEstUsd).toBe("unknown");
  });

  it("keeps other sizes and colors on the same SKU", () => {
    const cover = productMasterDrafts.find((draft) => draft.id === "CSH-VELA-01-RST-45x45");
    expect(cover?.sizeVariants?.en).toContain("45x45 / 40x40 / 30x50 / 30x45");
    expect(productMasterDrafts.filter((draft) => draft.id.startsWith("CSH-VELA-01"))).toHaveLength(1);
    const vase = productMasterV1.find((record) => record.sku === "OBJ-KILN-02-BEI-M");
    expect(vase?.colors).toBe("White / Black / Beige");
    expect(productMasterDrafts.filter((draft) => draft.id.startsWith("OBJ-KILN-02"))).toHaveLength(1);
    expect(productMasterDrafts.find((draft) => draft.id === "OBJ-KILN-02-BEI-M")?.colors?.en).toBe("White / Black / Beige");
  });

  it("imports WAL-LOOM rows as do-not-list and off-assortment", () => {
    expect(DO_NOT_LIST_SKUS).toHaveLength(3);
    for (const sku of DO_NOT_LIST_SKUS) {
      const record = productMasterV1.find((item) => item.sku === sku);
      const draft = productMasterDrafts.find((item) => item.id === sku);
      expect(record?.offAssortment).toBe(true);
      expect(record?.listingRecommendation).toBe("do-not-list");
      expect(draft?.offAssortment).toBe(true);
      expect(draft?.listingRecommendation).toBe("do-not-list");
      expect(record?.brandFitFlag).toContain("Off-brief");
    }
  });

  it("keeps lamp voltage notes and leaves only LGT-ORLA-01 marked US-ready", () => {
    const lamps = productMasterV1.filter((record) => record.categoryCode === "LGT");
    expect(lamps.map((record) => record.sku).filter((sku) => productMasterV1.find((record) => record.sku === sku)?.usReady)).toEqual([US_READY_SKU]);
    for (const lamp of lamps) {
      expect(lamp.complianceNotes).toContain("120V");
      expect(lamp.complianceNotes).toContain("E26");
      expect(lamp.certificationsStated.trim().length).toBeGreaterThan(0);
      const draft = productMasterDrafts.find((item) => item.id === lamp.sku);
      expect(draft?.available).toBe(false);
      expect(draft?.status).toBe("draft");
      expect(isPurchasable({ ...draft!, price: 340, available: true })).toBe(false);
    }
    expect(productMasterV1.find((record) => record.sku === US_READY_SKU)?.brandFitFlag).toContain("E26");
    expect(productMasterV1.find((record) => record.sku === "LGT-ORLA-02-WHT-STD-UK")?.brandFitFlag).toContain("E27");
    expect(productMasterV1.find((record) => record.sku === "LGT-PLIS-02-IVR-STD-US")?.brandFitFlag).toContain("battery");
    expect(productMasterV1.find((record) => record.sku === "LGT-TRAV-02-BEI-MSH-UK")?.brandFitFlag).toContain("90-260V");
    expect(productMasterV1.find((record) => record.sku === "LGT-TRAV-02-BEI-MSH-UK")?.dimensionsSizeVariants).toBe("unknown");
  });

  it("hides drafts from the public catalog and keeps supplier fields internal", () => {
    const listed = listPublicFallbackProducts();
    expect(listed).toHaveLength(products.length);
    expect(listed.some((product) => product.id === "indigo-tide-rug" && product.price === 4280 && product.available)).toBe(true);
    const listedIds = new Set(listed.map((product) => product.id));
    for (const record of productMasterV1) {
      expect(listedIds.has(record.sku)).toBe(false);
      expect(products.some((product) => product.id === record.sku || product.slug === record.sku.toLowerCase())).toBe(false);
    }
    const publicJson = JSON.stringify(productMasterDrafts);
    const listedJson = JSON.stringify(listed);
    for (const secret of ["made-in-china.com", "Yabang", "EST ", "90-260V", "fobUnitEstUsd", "supplierType"]) {
      expect(publicJson).not.toContain(secret);
      expect(listedJson).not.toContain(secret);
    }
    expect(JSON.stringify(products)).not.toContain("made-in-china.com");
  });

  it("lists preview drafts on the shop catalog and keeps them unpriced", async () => {
    const catalog = await getCatalog();
    const drafts = catalog.products.filter((product) => product.status === "draft");
    expect(drafts).toHaveLength(47);
    expect(drafts.some((product) => product.id.startsWith("WAL-LOOM"))).toBe(false);
    expect(drafts.every((product) => isPreviewListedProduct(product) && !isPublicCatalogProduct(product) && !isPurchasable(product) && product.price === 0)).toBe(true);
    expect(catalog.products.some((product) => product.id === "indigo-tide-rug")).toBe(true);
    expect(productsForShop(catalog.products, "art-rugs").every((product) => product.status === "draft" && product.category === "art-rugs")).toBe(true);
    expect(productsForShop(catalog.products, "art-rugs")).toHaveLength(10);
    expect(productsForShop(catalog.products, "wall-art").some((product) => product.id.startsWith("WAL-LOOM"))).toBe(false);
    expect(productsForShop(catalog.products)[0]?.status).toBe("draft");
    expect(JSON.stringify(catalog)).not.toContain("made-in-china.com");
    const terra = drafts.find((product) => product.id === "RUG-TERRA-01-SND-160x230");
    expect(terra?.image).toBeUndefined();
    expect(terra?.images).toEqual([]);
    const clay = drafts.find((product) => product.id === "RUG-TERRA-04-CLY-160x230");
    expect(clay?.description?.en).toBe("Hand-tufted wool in a muted clay tone; hank-dyed yarn for depth of colour.");
    expect(clay?.unverifiedFields).toContain("material");
    expect(clay?.material?.en).toContain("bamboo viscose");
  });
});
