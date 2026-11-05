import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SelectionHydrator } from "@/components/selection-hydrator";

export function generateStaticParams() { return [{ locale: "zh-CN" }, { locale: "en" }]; }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <><SelectionHydrator /><SiteHeader locale={locale} /><main>{children}</main><SiteFooter locale={locale} /></>;
}
