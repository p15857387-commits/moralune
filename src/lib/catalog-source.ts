import imageUrlBuilder from "@sanity/image-url";
import { categories as fallbackCategories, products as fallbackProducts } from "@/data/catalog";
import { hasSanityRead } from "./env";
import { sanityClient } from "./sanity";
import type { Category, Product } from "@/types";

type SanityProduct = Omit<Product, "image"> & { image?: unknown };

export async function getCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  if (!hasSanityRead || !sanityClient) return { products: fallbackProducts, categories: fallbackCategories };
  try {
    const [remoteProducts, remoteCategories] = await Promise.all([
      sanityClient.fetch<SanityProduct[]>(`*[_type == "product"] | order(featured desc, name.en asc){"id": _id,"slug": slug.current,name,description,story,material,dimensions,care,price,"category": category->slug.current,available,featured,shopifyVariantId,shoppaasBuyUrl,"image": images[0]}`),
      sanityClient.fetch<Category[]>(`*[_type == "category"] | order(order asc){"id": _id,"slug": slug.current,name,description}`),
    ]);
    const builder = imageUrlBuilder(sanityClient);
    const mapped = remoteProducts.map((product) => ({ ...product, image: product.image ? builder.image(product.image).width(1400).quality(86).url() : fallbackProducts.find((item) => item.slug === product.slug)?.image }));
    return { products: mapped.length ? mapped : fallbackProducts, categories: remoteCategories.length ? remoteCategories : fallbackCategories };
  } catch {
    return { products: fallbackProducts, categories: fallbackCategories };
  }
}

export async function getCatalogProduct(slug: string) {
  const catalog = await getCatalog();
  return { product: catalog.products.find((item) => item.slug === slug), products: catalog.products };
}
