import type { Locale, LocalizedText, Product, SelectionItem, SnapshotItem } from "@/types";

const hiddenListing = new Set(["do-not-list", "off-assortment"]);

export function isPublicCatalogProduct(product: Pick<Product, "status" | "published" | "listingRecommendation" | "offAssortment">): boolean {
  if (product.published === false) return false;
  if (product.status === "draft") return false;
  if (product.listingRecommendation && hiddenListing.has(product.listingRecommendation)) return false;
  if (product.offAssortment) return false;
  return true;
}

/** Shop and PDP listing for this noindex preview. Drafts are visible. Off-assortment rows stay hidden. */
export function isPreviewListedProduct(product: Pick<Product, "status" | "published" | "listingRecommendation" | "offAssortment">): boolean {
  if (product.offAssortment) return false;
  if (product.listingRecommendation && hiddenListing.has(product.listingRecommendation)) return false;
  if (product.published === false || product.status === "draft") return true;
  return isPublicCatalogProduct(product);
}

export function isPreviewDraft(product: Pick<Product, "status" | "published">): boolean {
  return product.status === "draft" || product.published === false;
}

export function isPurchasable(product: Pick<Product, "status" | "published" | "listingRecommendation" | "offAssortment" | "available" | "price">): boolean {
  return isPublicCatalogProduct(product) && product.available === true && product.price > 0;
}

const storefrontOptionalKeys = [
  "description", "story", "material", "dimensions", "care", "colors", "sizeVariants", "craft",
  "category", "featured", "status", "published", "listingRecommendation", "offAssortment",
  "shopifyVariantId", "shoppaasBuyUrl", "image", "images", "unverifiedFields", "imageTone",
] as const;

export function toStorefrontProduct(product: Product): Product {
  const storefront: Product = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    available: product.available,
  };
  const source = product as Product & Record<(typeof storefrontOptionalKeys)[number], unknown>;
  for (const key of storefrontOptionalKeys) {
    if (source[key] !== undefined) storefront[key] = source[key] as never;
  }
  return storefront;
}

export function localize(value: LocalizedText | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale]?.trim() || value["zh-CN"] || value.en || "";
}

const categoryOrder = ["art-rugs", "cushions-throws", "wall-art", "artful-storage", "decorative-lighting"];

export function sortCategories<T extends { slug: string }>(categories: T[]): T[] {
  return [...categories].sort((a, b) => {
    const ai = categoryOrder.indexOf(a.slug);
    const bi = categoryOrder.indexOf(b.slug);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
}

export function displayName(value: LocalizedText | undefined, locale: Locale): string {
  const raw = localize(value, locale);
  if (locale !== "en" || !raw) return raw;
  const lower = raw.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatPrice(price: number, locale: Locale = "zh-CN") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(price);
}

/** Confirmed sell price only. Preview drafts stay unpriced, including price 0. */
export function formatListedPrice(product: Pick<Product, "price" | "status" | "published">, locale: Locale): string | undefined {
  if (isPreviewDraft(product) || product.price <= 0) return undefined;
  return formatPrice(product.price, locale);
}

/**
 * Category pages prefer supplier drafts when that category has any.
 * The full shop keeps demo products after the drafts so the page is never empty of known objects.
 */
export function productsForShop<T extends Pick<Product, "status" | "published" | "listingRecommendation" | "offAssortment" | "category">>(products: T[], categorySlug?: string): T[] {
  const listed = products.filter(isPreviewListedProduct);
  const scoped = categorySlug ? listed.filter((product) => product.category === categorySlug) : listed;
  const drafts = scoped.filter((product) => isPreviewDraft(product));
  const published = scoped.filter((product) => !isPreviewDraft(product));
  if (categorySlug && drafts.length > 0) return drafts;
  return [...drafts, ...published];
}

export function snapshotSelection(items: SelectionItem[], products: Pick<Product, "id" | "slug" | "name" | "price" | "available" | "status" | "published" | "listingRecommendation" | "offAssortment">[], locale: Locale) {
  const unavailableIds: string[] = [];
  const snapshotItems: SnapshotItem[] = [];

  for (const item of items) {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product || !isPurchasable(product)) {
      unavailableIds.push(item.productId);
      continue;
    }
    const quantity = Math.max(1, Math.min(20, Math.floor(item.quantity)));
    snapshotItems.push({
      productId: product.id,
      slug: product.slug,
      name: localize(product.name, locale),
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  return { items: snapshotItems, total: snapshotItems.reduce((sum, item) => sum + item.lineTotal, 0), unavailableIds };
}
