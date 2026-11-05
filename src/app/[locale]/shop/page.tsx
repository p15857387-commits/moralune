import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { getCatalog } from "@/lib/catalog-source";
import { localize, sortCategories } from "@/lib/catalog";
import { isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ locale }, { category }] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) return {};
  const { categories } = await getCatalog();
  const active = sortCategories(categories).find((item) => item.slug === category);
  const title = active ? localize(active.name, locale) : locale === "zh-CN" ? "全部选物" : "Shop";
  return { title };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const [{ locale }, { category }] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const zh = locale === "zh-CN";
  const { categories, products } = await getCatalog();
  const ordered = sortCategories(categories);
  const active = ordered.find((item) => item.slug === category);
  const visible = active ? products.filter((product) => product.category === active.slug) : products;
  const title = active ? localize(active.name, locale) : zh ? "全部选物" : "Shop";
  const lead = active
    ? localize(active.description, locale)
    : zh
      ? "块毯、抱枕与披肩、墙面、器物与灯具，为日常的房间而选。"
      : "Rugs, cushions and throws, wall, objects, and lighting — chosen for everyday rooms.";
  const countLabel = zh ? `${visible.length} 件` : `${visible.length} ${visible.length === 1 ? "object" : "objects"}`;

  return (
    <div className="shop-page page-shell">
      <header className="page-intro">
        <p className="eyebrow">{zh ? "选物" : "Shop"}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </header>
      <nav className="filters category-chips" aria-label={zh ? "品类" : "Product categories"}>
        <Link className={!active ? "active" : ""} href={`/${locale}/shop`} aria-current={!active ? "page" : undefined}>{zh ? "全部" : "All"}</Link>
        {ordered.map((item) => (
          <Link key={item.id} className={active?.id === item.id ? "active" : ""} href={`/${locale}/shop?category=${item.slug}`} aria-current={active?.id === item.id ? "page" : undefined}>
            {localize(item.name, locale)}
          </Link>
        ))}
      </nav>
      <p className="result-count">{countLabel}</p>
      <ProductGrid products={visible} locale={locale} />
    </div>
  );
}
