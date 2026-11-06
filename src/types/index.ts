export type Locale = "zh-CN" | "en";
export type LocalizedText = Record<Locale, string>;
export type ListingStatus = "draft" | "published";
export type ListingRecommendation = "pending-review" | "do-not-list" | "off-assortment";
export type WatermarkFlag = "no" | "yes" | "suspected";
export type UnverifiedSpecField = "material" | "dimensions" | "care" | "colors" | "craft";

export type ProductImage = {
  src: string;
  /** Filename inside the SKU folder. Replacements keep this name. */
  filename?: string;
  role: "hero" | "gallery";
  watermark?: WatermarkFlag;
};

export type Category = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
};

export type Product = {
  id: string;
  slug: string;
  name: LocalizedText;
  description?: LocalizedText;
  story?: LocalizedText;
  material?: LocalizedText;
  dimensions?: LocalizedText;
  care?: LocalizedText;
  price: number;
  category?: string;
  available: boolean;
  featured?: boolean;
  /** Omitted on the existing demo assortment, which stays published. */
  status?: ListingStatus;
  /**
   * false keeps the product out of checkout, inquiry pricing, and the sitemap.
   * Preview drafts still use false and can appear on the shop and PDP.
   * Omitted means published.
   */
  published?: boolean;
  listingRecommendation?: ListingRecommendation;
  /** Kept in master data and excluded from the public assortment. */
  offAssortment?: boolean;
  /** Other sizes from one master row. Not split into extra SKUs. */
  sizeVariants?: LocalizedText;
  colors?: LocalizedText;
  craft?: LocalizedText;
  shopifyVariantId?: string;
  shoppaasBuyUrl?: string;
  /** Hero image. Existing cards and strips read this field. */
  image?: string;
  /** Hero first, then the rest of the gallery. Drop-in files keep the same src. */
  images?: ProductImage[];
  /** Spec lines copied from the supplier master that must not be read as confirmed facts. */
  unverifiedFields?: UnverifiedSpecField[];
  imageTone?: string;
};

export type SelectionItem = { productId: string; quantity: number };
export type SnapshotItem = SelectionItem & {
  slug: string;
  name: string;
  unitPrice: number;
  lineTotal: number;
};
