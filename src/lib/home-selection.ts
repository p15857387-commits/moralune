import { photoMismatchSkus } from "@/data/product-photos-v1";
import { productsForShop } from "@/lib/catalog";
import type { Product } from "@/types";

/** How many pieces each homepage category shows, when that many exist. */
export const homeCategoryLimit = 6;

export type HomeCategoryEdit<T> = {
  slug: string;
  items: T[];
  eligible: number;
  shown: number;
  shortfall: number;
};

/**
 * Image-led homepage edit for one shop category.
 * Uses the same listing rules as the shop: drafts in a category replace the
 * demo assortment, and do-not-list / off-assortment rows stay out.
 * Products without a photo are omitted. Mismatched frames (RUG-TERRA-01)
 * stay out even if an image path is later attached.
 * Never pads with duplicates.
 */
export function imageLedHomeEdit<T extends Pick<Product, "id" | "image" | "status" | "published" | "listingRecommendation" | "offAssortment" | "category">>(
  products: T[],
  slug: string,
): HomeCategoryEdit<T> {
  const seen = new Set<string>();
  const eligible = productsForShop(products, slug).filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    if (photoMismatchSkus.has(product.id)) return false;
    if (!product.image) return false;
    if (product.image.includes("RUG-TERRA-01-SND-160x230")) return false;
    return true;
  });
  const items = eligible.slice(0, homeCategoryLimit);
  return {
    slug,
    items,
    eligible: eligible.length,
    shown: items.length,
    shortfall: Math.max(0, homeCategoryLimit - eligible.length),
  };
}
