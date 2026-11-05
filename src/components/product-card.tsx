import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, localize } from "@/lib/catalog";
import type { Locale, Product } from "@/types";

export function ProductCard({ product, locale, index = 0 }: { product: Product; locale: Locale; index?: number }) {
  return (
    <article className="product-card" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
      <Link className="product-image-wrap" href={`/${locale}/products/${product.slug}`}>
        <Image src={product.image!} alt={localize(product.name, locale)} fill sizes="(max-width: 700px) 50vw, 25vw" className="product-image" />
        {!product.available && <span className="status-pill">{locale === "zh-CN" ? "暂时缺货" : "Unavailable"}</span>}
        <span className="card-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-info"><div><h3><Link href={`/${locale}/products/${product.slug}`}>{localize(product.name, locale)}</Link></h3><p>{formatPrice(product.price, locale)}</p></div><span>{locale === "zh-CN" ? "含税参考价" : "Indicative price"}</span></div>
    </article>
  );
}
