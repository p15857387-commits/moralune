import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PreviewNotice } from "@/components/preview-notice";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductGrid } from "@/components/product-grid";
import { products as fallbackProducts } from "@/data/catalog";
import { productMasterDrafts } from "@/data/product-master-v1";
import { getCatalogProduct } from "@/lib/catalog-source";
import { displayName, formatListedPrice, isPreviewDraft, isPreviewListedProduct, localize } from "@/lib/catalog";
import { isLocale, locales, t } from "@/lib/i18n";
import { env, hasShoppaas } from "@/lib/env";
import { previewRobots } from "@/lib/site-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const products = [...fallbackProducts, ...productMasterDrafts].filter(isPreviewListedProduct);
  return locales.flatMap((locale) => products.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { product } = await getCatalogProduct(slug);
  return product ? { title: displayName(product.name, locale), description: localize(product.description, locale), robots: previewRobots } : { robots: previewRobots };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const catalog = await getCatalogProduct(slug);
  const product = catalog.product;
  if (!product || !isPreviewListedProduct(product)) notFound();
  const copy = t(locale);
  const zh = locale === "zh-CN";
  const preview = isPreviewDraft(product);
  const related = catalog.products.filter((item) => item.id !== product.id && item.category === product.category && isPreviewListedProduct(item)).slice(0, 3);
  const shoppaasUrl = product.shoppaasBuyUrl || env.SHOPPAAS_STORE_URL;
  const unverified = new Set(product.unverifiedFields ?? []);
  const unverifiedLabel = zh ? "尚未确认" : "Not confirmed";
  const specs = [
    { label: copy.material, body: localize(product.material, locale), unverified: unverified.has("material") },
    { label: copy.dimensions, body: localize(product.dimensions, locale), unverified: unverified.has("dimensions") },
    { label: copy.care, body: localize(product.care, locale), unverified: unverified.has("care") },
  ].filter((spec) => spec.body);
  const frames = product.images?.length ? product.images : product.image ? [{ src: product.image, role: "hero" as const }] : [];
  const listedPrice = formatListedPrice(product, locale);
  const badgeLabel = product.available ? (zh ? "现货" : "Available") : preview ? (zh ? "预览" : "Preview") : copy.unavailable;

  return (
    <div className="product-page page-shell">
      <Link className="back-link" href={`/${locale}/shop`}><ArrowLeft size={16} />{zh ? "返回选物" : "Back to shop"}</Link>
      <PreviewNotice locale={locale} />
      <div className="product-detail">
        <ProductGallery frames={frames} alt={displayName(product.name, locale)} badge={{ label: badgeLabel, available: product.available, preview }} emptyLabel={zh ? "供应商图片与这件单品不符。" : "No matching supplier photo for this piece."} />
        <div className="product-detail-copy">
          <p className="eyebrow">{zh ? "器物" : "Object"}</p>
          <h1>{displayName(product.name, locale)}</h1>
          <p className={listedPrice ? "detail-price" : "detail-price detail-price-preview"}>{listedPrice ?? (zh ? "暂不出售" : "Not for sale")}</p>
          <p className="detail-description">{localize(product.description, locale)}</p>
          {preview ? (
            <p className="price-note">{zh ? "此为内部预览，不能加入清单或结账。" : "Internal preview only. This piece cannot be added or checked out."}</p>
          ) : (
            <>
              <ProductPurchase productId={product.id} available={product.available} addLabel={copy.add} unavailableLabel={copy.unavailable} />
              {hasShoppaas && shoppaasUrl && product.available && (
                <a className="shoppaas-button" href={shoppaasUrl} target="_blank" rel="noreferrer">
                  <span>SHOPPAAS</span>{zh ? "前往安全购买" : "Continue to secure purchase"}<ArrowLeft className="shoppaas-arrow" size={16} />
                </a>
              )}
              <p className="price-note">{copy.priceNote}</p>
            </>
          )}
        </div>
      </div>
      {specs.length > 0 && (
        <section className="spec-blocks" aria-label={zh ? "规格" : "Specifications"}>
          {specs.map((spec) => (
            <article key={spec.label}>
              <h2>{spec.label}</h2>
              {spec.unverified && <p className="spec-caveat">{unverifiedLabel}</p>}
              <p>{spec.body}</p>
            </article>
          ))}
        </section>
      )}
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
