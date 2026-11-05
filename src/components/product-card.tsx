import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { displayName, formatPrice } from "@/lib/catalog";
import type { Locale, Product } from "@/types";

export function ProductCard({ product, locale, index = 0 }: { product: Product; locale: Locale; index?: number }) {
  const name = displayName(product.name, locale);
  const availableLabel = locale === "zh-CN" ? "现货" : "Available";
  const unavailableLabel = locale === "zh-CN" ? "暂时缺货" : "Unavailable";
  return (
    <article className="product-card" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
      <Link className="product-image-wrap" href={`/${locale}/products/${product.slug}`}>
        <Image src={product.image!} alt={name} fill sizes="(max-width: 700px) 50vw, 25vw" className="product-image" />
        <span className={product.available ? "status-pill is-available" : "status-pill"}>{product.available ? availableLabel : unavailableLabel}</span>
        <span className="card-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-info">
        <div>
          <h3><Link href={`/${locale}/products/${product.slug}`}>{name}</Link></h3>
          <p>{formatPrice(product.price, locale)}</p>
        </div>
      </div>
    </article>
  );
}
