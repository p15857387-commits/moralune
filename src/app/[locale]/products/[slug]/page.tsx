import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductGrid } from "@/components/product-grid";
import { products as fallbackProducts } from "@/data/catalog";
import { getCatalogProduct } from "@/lib/catalog-source";
import { formatPrice, localize } from "@/lib/catalog";
import { isLocale, t } from "@/lib/i18n";
import { env, hasShoppaas } from "@/lib/env";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return ["zh-CN", "en"].flatMap((locale) => fallbackProducts.map((product) => ({ locale, slug: product.slug }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale, slug } = await params; if (!isLocale(locale)) return {}; const { product } = await getCatalogProduct(slug); return product ? { title: localize(product.name, locale), description: localize(product.description, locale) } : {}; }

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const catalog = await getCatalogProduct(slug); const product = catalog.product; if (!product) notFound(); const copy = t(locale);
  const products = catalog.products;
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  const shoppaasUrl = product.shoppaasBuyUrl || env.SHOPPAAS_STORE_URL;
  return <div className="product-page page-shell"><Link className="back-link" href={`/${locale}/shop`}><ArrowLeft size={16} />{locale === "zh-CN" ? "返回选物" : "Back to collection"}</Link><div className="product-detail"><div className="product-detail-image"><Image src={product.image!} alt={localize(product.name, locale)} fill priority sizes="(max-width: 850px) 100vw, 58vw" />{!product.available && <span className="status-pill">{copy.unavailable}</span>}<span className="detail-image-note">MORALUNE · OBJECTS FOR LIVING</span></div><div className="product-detail-copy"><p className="eyebrow">MORALUNE EDIT · {product.category?.toUpperCase()}</p><h1>{localize(product.name, locale)}</h1><p className="detail-price">{formatPrice(product.price, locale)}</p><p className="detail-description">{localize(product.description, locale)}</p><ProductPurchase productId={product.id} available={product.available} addLabel={copy.add} unavailableLabel={copy.unavailable} />{hasShoppaas && shoppaasUrl && product.available && <a className="shoppaas-button" href={shoppaasUrl} target="_blank" rel="noreferrer"><span>SHOPPAAS</span>{locale === "zh-CN" ? "前往安全购买" : "Continue to secure purchase"}<ArrowLeft className="shoppaas-arrow" size={16} /></a>}<p className="price-note">{copy.priceNote}</p><dl><div><dt>{copy.material}</dt><dd>{localize(product.material, locale)}</dd></div><div><dt>{copy.dimensions}</dt><dd>{localize(product.dimensions, locale)}</dd></div><div><dt>{copy.care}</dt><dd>{localize(product.care, locale)}</dd></div></dl></div></div>{product.story && <section className="product-story"><p className="eyebrow">{locale === "zh-CN" ? "关于这件物品" : "THE OBJECT"}</p><p>{localize(product.story, locale)}</p></section>}{related.length > 0 && <section className="related"><div className="section-heading"><p className="eyebrow">{locale === "zh-CN" ? "也许你还喜欢" : "YOU MAY ALSO LIKE"}</p><h2>{locale === "zh-CN" ? "同一处日常，更多选择。" : "More for the same ritual."}</h2></div><ProductGrid products={related} locale={locale} /></section>}</div>;
}
