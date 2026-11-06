import type { ListingRecommendation, LocalizedText, Product } from "@/types";
import rows from "./product-master-v1.json";

/**
 * Product master v1, imported as unpublished drafts.
 * Field mapping, counts, and caveats: src/data/IMPORT.md.
 *
 * Supplier, FOB, source URL, margin, and supplier type stay on ProductMasterRecord.
 * toPublicProductDraft() does not copy them onto the storefront Product.
 * Suggested retail estimates are not Product.price and are not PayPal USD prices.
 * zh-CN copy is intentionally blank. TODO: translate; do not invent Chinese marketing copy.
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

export function toPublicProductDraft(record: ProductMasterRecord): Product {
  return {
    id: record.sku,
    slug: record.sku.toLowerCase(),
    name: draftCopy(record.titleEnDraft),
    description: draftCopy(record.shortDescriptionEnDraft),
    material: draftCopy(record.materialComposition),
    dimensions: draftCopy(record.dimensionsSizeVariants),
    sizeVariants: draftCopy(record.dimensionsSizeVariants),
    colors: draftCopy(record.colors),
    craft: draftCopy(record.craft),
    care: draftCopy(record.careLabelEnDraft),
    price: 0,
    category: record.catalogCategory,
    available: false,
    featured: false,
    status: "draft",
    published: false,
    listingRecommendation: record.listingRecommendation,
    offAssortment: record.offAssortment,
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
}
