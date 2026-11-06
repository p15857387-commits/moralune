import type { ListingRecommendation, LocalizedText, Product, UnverifiedSpecField } from "@/types";
import rows from "./product-master-v1.json";
import { productPhotosBySku } from "./product-photos-v1";

/**
 * Product master v1, imported as unpublished drafts.
 * Field mapping, counts, and caveats: src/data/IMPORT.md.
 *
 * Supplier, FOB, source URL, margin, and supplier type stay on ProductMasterRecord.
 * toPublicProductDraft() does not copy them onto the storefront Product.
 * Suggested retail estimates are not Product.price and are not PayPal USD prices.
 * zh-CN copy is intentionally blank. TODO: translate; do not invent Chinese marketing copy.
 *
 * This preview lists the drafts on the shop and PDP. They stay unpublished, unpriced,
 * and unavailable. Photos and the swap path: src/data/PHOTOS.md.
 */

export const CATEGORY_BY_CODE = {
  RUG: "art-rugs",
  CSH: "cushions-throws",
  THR: "cushions-throws",
  WAL: "wall-art",
  OBJ: "artful-storage",
  LGT: "decorative-lighting",
} as const;

export type ProductMasterCategoryCode = keyof typeof CATEGORY_BY_CODE;

export const DO_NOT_LIST_SKUS = [
  "WAL-LOOM-01-NAT-68x40",
  "WAL-LOOM-02-NAT-35x34",
  "WAL-LOOM-03-NAT-35x35",
] as const;

export const US_READY_SKU = "LGT-ORLA-01-BLK-D41xH70-US";

export type ProductMasterRow = {
  categoryCode: string;
  sku: string;
  supplier: string;
  supplierType: string;
  sourceUrl: string;
  productNameSource: string;
  materialComposition: string;
  craft: string;
  dimensionsSizeVariants: string;
  colors: string;
  weight: string;
  packaging: string;
  moq: string;
  listedPrice: string;
  priceCaptured: string;
  sampleTime: string;
  bulkLeadTime: string;
  certificationsStated: string;
  careStatedBySource: string;
  titleEnDraft: string;
  shortDescriptionEnDraft: string;
  careLabelEnDraft: string;
  complianceNotes: string;
  fobUnitEstUsd: string;
  suggestedRetailUsdEst: string;
  impliedGrossMarginEst: string;
  brandFitFlag: string;
  urlCheck: string;
};

export type ProductMasterRecord = Omit<ProductMasterRow, "categoryCode"> & {
  categoryCode: ProductMasterCategoryCode;
  catalogCategory: (typeof CATEGORY_BY_CODE)[ProductMasterCategoryCode];
  listingRecommendation: ListingRecommendation;
  offAssortment: boolean;
  /** Stated US electrical readiness. Never means the SKU can be purchased. */
  usReady: boolean;
};

const rowKeys: (keyof ProductMasterRow)[] = [
  "categoryCode", "sku", "supplier", "supplierType", "sourceUrl", "productNameSource",
  "materialComposition", "craft", "dimensionsSizeVariants", "colors", "weight", "packaging",
  "moq", "listedPrice", "priceCaptured", "sampleTime", "bulkLeadTime", "certificationsStated",
  "careStatedBySource", "titleEnDraft", "shortDescriptionEnDraft", "careLabelEnDraft",
  "complianceNotes", "fobUnitEstUsd", "suggestedRetailUsdEst", "impliedGrossMarginEst",
  "brandFitFlag", "urlCheck",
];

function isCategoryCode(value: string): value is ProductMasterCategoryCode {
  return Object.prototype.hasOwnProperty.call(CATEGORY_BY_CODE, value);
}

function draftCopy(en: string): LocalizedText {
  return { "zh-CN": "", en };
}

function enrich(row: ProductMasterRow): ProductMasterRecord {
  if (!isCategoryCode(row.categoryCode)) throw new Error(`Unknown product-master category ${row.categoryCode} on ${row.sku}`);
  const offAssortment = (DO_NOT_LIST_SKUS as readonly string[]).includes(row.sku);
  return {
    ...row,
    categoryCode: row.categoryCode,
    catalogCategory: CATEGORY_BY_CODE[row.categoryCode],
    listingRecommendation: offAssortment ? "do-not-list" : "pending-review",
    offAssortment,
    usReady: row.sku === US_READY_SKU,
  };
}

export function isUnknownMasterValue(value: string): boolean {
  const text = value.trim().toLowerCase();
  return text === "unknown" || text.startsWith("unknown ") || text.startsWith("unknown(") || text.includes("not usable") || text.includes("placeholder");
}

/** Supplier text that is incomplete, conflicting, or explicitly unverified. */
export function isUncertainMasterValue(value: string): boolean {
  if (isUnknownMasterValue(value)) return true;
  const text = value.trim().toLowerCase();
  return text.includes("unknown")
    || text.includes("conflict")
    || text.includes("unverified")
    || text.includes("not confirmed")
    || text.includes("doubtful")
    || text.includes("not meaningful")
    || text.includes("as stated")
    || text.includes("title mentions")
    || text.includes("title says")
    || text.includes("ratio")
    || text.includes("generically")
    || /\boptions\b/.test(text);
}

function presentClaim(value: string): { text?: string; unverified: boolean } {
  const trimmed = value.trim();
  if (!trimmed || isUnknownMasterValue(trimmed)) return { unverified: false };
  return { text: trimmed, unverified: isUncertainMasterValue(trimmed) };
}

export function softenDraftDescription(record: ProductMasterRecord): string {
  let text = record.shortDescriptionEnDraft.trim();
  if (isUncertainMasterValue(record.materialComposition)) {
    text = text.replace(/\b100\s*%\s*/gi, "");
  }
  return text
    .replace(/\bOEKO-TEX\b/gi, "")
    .replace(/\bOEKO TEX\b/gi, "")
    .replace(/\b(SGS|BSCI|ETL|RoHS|FCC|CE)\b/gi, "")
    .replace(/\bcertified\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;])/g, "$1")
    .trim();
}

export function toPublicProductDraft(record: ProductMasterRecord): Product {
  const material = presentClaim(record.materialComposition);
  const dimensions = presentClaim(record.dimensionsSizeVariants);
  const colors = presentClaim(record.colors);
  const craft = presentClaim(record.craft);
  const careText = isUnknownMasterValue(record.careLabelEnDraft) ? undefined : record.careLabelEnDraft.trim();
  const unverifiedFields: UnverifiedSpecField[] = [];
  if (material.unverified && material.text) unverifiedFields.push("material");
  if (dimensions.unverified && dimensions.text) unverifiedFields.push("dimensions");
  if (colors.unverified && colors.text) unverifiedFields.push("colors");
  if (craft.unverified && craft.text) unverifiedFields.push("craft");
  const images = productPhotosBySku[record.sku] ?? [];
  const hero = images[0];
  if (!hero && record.sku !== "RUG-TERRA-01-SND-160x230") throw new Error(`Missing photos for ${record.sku}`);

  return {
    id: record.sku,
    slug: record.sku.toLowerCase(),
    name: draftCopy(record.titleEnDraft),
    description: draftCopy(softenDraftDescription(record)),
    ...(material.text ? { material: draftCopy(material.text) } : {}),
    ...(dimensions.text ? { dimensions: draftCopy(dimensions.text), sizeVariants: draftCopy(dimensions.text) } : {}),
    ...(colors.text ? { colors: draftCopy(colors.text) } : {}),
    ...(craft.text ? { craft: draftCopy(craft.text) } : {}),
    ...(careText ? { care: draftCopy(careText) } : {}),
    ...(unverifiedFields.length ? { unverifiedFields } : {}),
    price: 0,
    category: record.catalogCategory,
    available: false,
    featured: false,
    status: "draft",
    published: false,
    listingRecommendation: record.listingRecommendation,
    offAssortment: record.offAssortment,
    ...(hero ? { image: hero.src, images } : { images: [] }),
  };
}

function loadRows(input: unknown): ProductMasterRecord[] {
  if (!Array.isArray(input)) throw new Error("Product master JSON must be an array");
  const records = input.map((row, index) => {
    if (!row || typeof row !== "object") throw new Error(`Product master row ${index} is not an object`);
    const source = row as Record<string, unknown>;
    const parsed = {} as ProductMasterRow;
    for (const key of rowKeys) {
      const value = source[key];
      if (typeof value !== "string" || value.trim() === "") throw new Error(`Product master row ${index} is missing ${key}`);
      parsed[key] = value;
    }
    return enrich(parsed);
  });
  const skus = new Set(records.map((record) => record.sku));
  if (skus.size !== records.length) throw new Error("Product master contains duplicate SKUs");
  if (!skus.has(US_READY_SKU)) throw new Error(`Missing US-ready lamp ${US_READY_SKU}`);
  for (const sku of DO_NOT_LIST_SKUS) {
    if (!skus.has(sku)) throw new Error(`Missing do-not-list SKU ${sku}`);
  }
  return records;
}

export const productMasterV1: ProductMasterRecord[] = loadRows(rows);

export const productMasterDrafts: Product[] = productMasterV1.map(toPublicProductDraft);

for (const draft of productMasterDrafts) {
  if (draft.price !== 0 || draft.available || draft.published !== false || draft.status !== "draft" || draft.featured) {
    throw new Error(`Product master draft ${draft.id} is not locked unpublished`);
  }
  if (draft.id === "RUG-TERRA-01-SND-160x230") {
    if (draft.image || draft.images?.length) throw new Error("RUG-TERRA-01 supplier frames are mismatched and must stay off the storefront");
    continue;
  }
  const hero = draft.images?.[0];
  if (!draft.image || !hero || hero.src !== draft.image || hero.role !== "hero") {
    throw new Error(`Product master draft ${draft.id} is missing a hero image`);
  }
  if (hero.watermark === "yes" && draft.images?.some((image) => image.watermark !== "yes")) {
    throw new Error(`Product master draft ${draft.id} uses a watermarked hero`);
  }
}
