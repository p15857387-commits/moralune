import { ProductCard } from "./product-card";
import type { Locale, Product } from "@/types";

export function ProductGrid({ products, locale }: { products: Product[]; locale: Locale }) {
  if (products.length === 0) {
    return <div className="product-grid-empty" role="status">{locale === "en" ? "This edit is taking shape. New objects are on their way." : "这个分类正在整理中，更多精选即将上架。"}</div>;
  }
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} locale={locale} index={index} />)}</div>;
}
