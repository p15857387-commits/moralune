import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { RugCarousel } from "@/components/rug-carousel";
import { getCatalog } from "@/lib/catalog-source";
import { localize } from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";

export default async function ShopPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string }> }) {
  const [{ locale }, { category }] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const { categories, products } = await getCatalog();
  const active = categories.find((item) => item.slug === category);
  const visible = active ? products.filter((product) => product.category === active.slug) : products;
  return <div className="shop-page page-shell"><header className="page-intro"><p className="eyebrow">{locale === "zh-CN" ? "日常选品" : "THE COLLECTION"}</p><h1>{active ? localize(active.name, locale) : locale === "zh-CN" ? "把喜欢的日常，带回家。" : "Bring home a gentler everyday."}</h1><p>{active ? localize(active.description, locale) : locale === "zh-CN" ? "从真实材质和长久使用出发，挑选安静、耐看且顺手的小物。" : "Quiet, tactile objects selected for honest materials and lasting use."}</p></header><nav className="filters" aria-label="Product categories"><Link className={!active ? "active" : ""} href={`/${locale}/shop`}>{locale === "zh-CN" ? "全部" : "All"}</Link>{categories.map((item) => <Link key={item.id} className={active?.id === item.id ? "active" : ""} href={`/${locale}/shop?category=${item.slug}`}>{localize(item.name, locale)}</Link>)}</nav><p className="result-count">{String(visible.length).padStart(2, "0")} {locale === "zh-CN" ? "件物品" : "objects"}</p>{active?.slug === "art-rugs" ? <RugCarousel products={visible} locale={locale} /> : <ProductGrid products={visible} locale={locale} />}</div>;
}
