import imageUrlBuilder from "@sanity/image-url";
import { categories as fallbackCategories, products as fallbackProducts } from "@/data/catalog";
import { productMasterDrafts } from "@/data/product-master-v1";
import { isPreviewListedProduct, isPublicCatalogProduct, toStorefrontProduct } from "./catalog";
import { hasSanityRead } from "./env";
import { sanityClient } from "./sanity";
import type { Category, Product } from "@/types";

type SanityProduct = Omit<Product, "image"> & { image?: unknown };

const productQuery = `*[_type == "product" && published != false && status != "draft" && listingRecommendation != "do-not-list" && listingRecommendation != "off-assortment" && offAssortment != true] | order(featured desc, name.en asc){
  "id": _id,
  "slug": slug.current,
  name,
  description,
  story,
  material,
  dimensions,
  care,
  price,
  "category": category->slug.current,
  available,
  featured,
  status,
  published,
  listingRecommendation,
  offAssortment,
  shopifyVariantId,
  shoppaasBuyUrl,
  "image": images[0]
}`;

function present(products: Product[]): Product[] {
  return products.filter(isPublicCatalogProduct).map(toStorefrontProduct);
}

export function listPublicFallbackProducts(): Product[] {
  return present(fallbackProducts);
}

function previewDrafts(): Product[] {
  return productMasterDrafts.filter(isPreviewListedProduct).map(toStorefrontProduct);
}

function withPreviewDrafts(products: Product[]): Product[] {
  const seenIds = new Set(products.map((product) => product.id));
  const seenSlugs = new Set(products.map((product) => product.slug));
  const drafts = previewDrafts().filter((draft) => !seenIds.has(draft.id) && !seenSlugs.has(draft.slug));
  return [...drafts, ...products];
}

/** Demo products plus preview drafts. Off-assortment master rows stay out. */
export function listPreviewFallbackProducts(): Product[] {
  return withPreviewDrafts(present(fallbackProducts));
}

export async function getCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const fallback = { products: listPreviewFallbackProducts(), categories: fallbackCategories };
  if (!hasSanityRead || !sanityClient) return fallback;
  try {
    const [remoteProducts, remoteCategories] = await Promise.all([
      sanityClient.fetch<SanityProduct[]>(productQuery),
      sanityClient.fetch<Category[]>(`*[_type == "category"] | order(order asc){"id": _id,"slug": slug.current,name,description}`),
    ]);
    const builder = imageUrlBuilder(sanityClient);
    const mapped = present(remoteProducts.map((product) => {
      const { image: remoteImage, ...rest } = product;
      const image = remoteImage
        ? builder.image(remoteImage).width(1400).quality(86).url()
        : fallbackProducts.find((item) => item.slug === product.slug)?.image;
      return { ...rest, image };
    }));
    const published = mapped.length ? mapped : present(fallbackProducts);
    return { products: withPreviewDrafts(published), categories: remoteCategories.length ? remoteCategories : fallbackCategories };
  } catch {
    return fallback;
  }
}

export async function getCatalogProduct(slug: string) {
  const catalog = await getCatalog();
  const product = catalog.products.find((item) => item.slug === slug);
  if (!product || !isPreviewListedProduct(product)) return { product: undefined, products: catalog.products };
  return { product, products: catalog.products };
}
