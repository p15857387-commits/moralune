export type Locale = "zh-CN" | "en";
export type LocalizedText = Record<Locale, string>;
export type ListingStatus = "draft" | "published";
export type ListingRecommendation = "pending-review" | "do-not-list" | "off-assortment";

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
  /** false hides the product from shop, PDP, sitemap, and checkout. Omitted means published. */
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
  image?: string;
  imageTone?: string;
};

export type SelectionItem = { productId: string; quantity: number };
export type SnapshotItem = SelectionItem & {
  slug: string;
  name: string;
  unitPrice: number;
  lineTotal: number;
};
