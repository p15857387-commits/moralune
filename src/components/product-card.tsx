import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { displayName, formatListedPrice, isPreviewDraft } from "@/lib/catalog";
import { formatUsdTestUnitNote } from "@/lib/usd-test-price";
import type { Locale, Product } from "@/types";

export function ProductCard({ product, locale, index = 0 }: { product: Product; locale: Locale; index?: number }) {
  const name = displayName(product.name, locale);
  const preview = isPreviewDraft(product);
  const availableLabel = locale === "zh-CN" ? "现货" : "Available";
  const unavailableLabel = locale === "zh-CN" ? "暂时缺货" : "Unavailable";
  const previewLabel = locale === "zh-CN" ? "预览" : "Preview";
  const price = formatListedPrice(product, locale);
  const notForSale = locale === "zh-CN" ? "暂不出售" : "Not for sale";
  const pillClass = product.available ? "status-pill is-available" : preview ? "status-pill is-preview" : "status-pill";
  return (
    <article className="product-card" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
      <Link className="product-image-wrap" href={`/${locale}/products/${product.slug}`}>
        {product.image ? <Image src={product.image} alt={name} fill sizes="(max-width: 700px) 50vw, 25vw" className="product-image" unoptimized={product.image.startsWith("/products/v2/")} /> : <span className="product-image-fallback">{locale === "zh-CN" ? "暂无匹配图片" : "No matching photo"}</span>}
        <span className={pillClass}>{product.available ? availableLabel : preview ? previewLabel : unavailableLabel}</span>
        <span className="card-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-info">
        <div>
          <h3><Link href={`/${locale}/products/${product.slug}`}>{name}</Link></h3>
          {price && <p className="test-price">{price}</p>}
          {price && <p className="test-unit">{formatUsdTestUnitNote(product.slug, locale)}</p>}
          <p>{price || preview ? notForSale : unavailableLabel}</p>
        </div>
      </div>
    </article>
  );
}
