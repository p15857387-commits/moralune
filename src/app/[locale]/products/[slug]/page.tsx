import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductGrid } from "@/components/product-grid";
import { products as fallbackProducts } from "@/data/catalog";
import { getCatalogProduct } from "@/lib/catalog-source";
import { displayName, formatPrice, isPublicCatalogProduct, localize } from "@/lib/catalog";
import { isLocale, locales, t } from "@/lib/i18n";
import { env, hasShoppaas } from "@/lib/env";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => fallbackProducts.filter(isPublicCatalogProduct).map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { product } = await getCatalogProduct(slug);
  return product ? { title: displayName(product.name, locale), description: localize(product.description, locale) } : {};
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const catalog = await getCatalogProduct(slug);
  const product = catalog.product;
  if (!product || !isPublicCatalogProduct(product)) notFound();
  const copy = t(locale);
  const zh = locale === "zh-CN";
  const related = catalog.products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  const shoppaasUrl = product.shoppaasBuyUrl || env.SHOPPAAS_STORE_URL;
  const specs = [
    { label: copy.material, body: localize(product.material, locale) },
    { label: copy.dimensions, body: localize(product.dimensions, locale) },
    { label: copy.care, body: localize(product.care, locale) },
  ];

  return (
    <div className="product-page page-shell">
      <Link className="back-link" href={`/${locale}/shop`}><ArrowLeft size={16} />{zh ? "返回选物" : "Back to shop"}</Link>
      <div className="product-detail">
        <div className="product-detail-image">
          <Image src={product.image!} alt={displayName(product.name, locale)} fill priority sizes="(max-width: 850px) 100vw, 58vw" />
          <span className={product.available ? "status-pill is-available" : "status-pill"}>{product.available ? (zh ? "现货" : "Available") : copy.unavailable}</span>
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">{zh ? "器物" : "Object"}</p>
          <h1>{displayName(product.name, locale)}</h1>
          <p className="detail-price">{formatPrice(product.price, locale)}</p>
          <p className="detail-description">{localize(product.description, locale)}</p>
          <ProductPurchase productId={product.id} available={product.available} addLabel={copy.add} unavailableLabel={copy.unavailable} />
          {hasShoppaas && shoppaasUrl && product.available && (
            <a className="shoppaas-button" href={shoppaasUrl} target="_blank" rel="noreferrer">
              <span>SHOPPAAS</span>{zh ? "前往安全购买" : "Continue to secure purchase"}<ArrowLeft className="shoppaas-arrow" size={16} />
            </a>
          )}
          <p className="price-note">{copy.priceNote}</p>
        </div>
      </div>
      <section className="spec-blocks" aria-label={zh ? "规格" : "Specifications"}>
        {specs.map((spec) => (
          <article key={spec.label}>
            <h2>{spec.label}</h2>
            <p>{spec.body}</p>
          </article>
        ))}
      </section>
      {product.story && (
        <section className="product-story">
          <p className="eyebrow">{zh ? "故事" : "Story"}</p>
          <p>{localize(product.story, locale)}</p>
        </section>
      )}
      {related.length > 0 && (
        <section className="related">
          <div className="section-heading">
            <p className="eyebrow">{zh ? "相关" : "Related"}</p>
            <h2>{zh ? "同一品类，再看三件。" : "Three more from this category."}</h2>
          </div>
          <ProductGrid products={related} locale={locale} />
        </section>
      )}
    </div>
  );
}
