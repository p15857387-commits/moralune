import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getCatalog } from "@/lib/catalog-source";
import { sortCategories } from "@/lib/catalog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SelectionHydrator } from "@/components/selection-hydrator";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { categories } = await getCatalog();
  return <><SelectionHydrator /><SiteHeader locale={locale} categories={sortCategories(categories)} /><main>{children}</main><SiteFooter locale={locale} /></>;
}
