import Link from "next/link";
import { LanguageSwitch } from "./language-switch";
import { SelectionLink } from "./selection-link";
import { MobileMenu } from "./mobile-menu";
import { t } from "@/lib/i18n";
import { localize } from "@/lib/catalog";
import type { Category, Locale } from "@/types";
import { brand, wordmarks } from "@/lib/brand";

export function SiteHeader({ locale, categories }: { locale: Locale; categories: Category[] }) {
  const copy = t(locale);
  const shopHref = `/${locale}/shop`;
  const aboutHref = `/${locale}/about`;
  const mobileLinks = [
    { href: shopHref, label: copy.shop },
    ...categories.map((category) => ({ href: `${shopHref}?category=${category.slug}`, label: localize(category.name, locale), kind: "category" as const })),
    { href: aboutHref, label: copy.about },
    { href: `/${locale}/selection`, label: copy.selection },
  ];
  return (
    <header className="site-header">
      <div className="announcement"><span>{locale === "zh-CN" ? "为日常，选一点刚刚好的美" : "A little beauty, chosen for everyday living"}</span></div>
      <div className="header-inner">
        <Link className="wordmark ml-wordmark" href={`/${locale}`} aria-label={brand.zh}>
          <span className="brand-logo-window"><img src={wordmarks.light} alt={brand.zh} /></span>
          <small>{brand.en}</small>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link className="nav-shop" href={shopHref}>{copy.shop}</Link>
          <Link href={aboutHref}>{copy.about}</Link>
        </nav>
        <div className="header-actions">
          <LanguageSwitch locale={locale} />
          <SelectionLink locale={locale} label={copy.selection} compact />
          <MobileMenu locale={locale} links={mobileLinks} />
        </div>
      </div>
      <nav className="category-nav" aria-label={locale === "zh-CN" ? "品类" : "Shop categories"}>
        {categories.map((category) => (
          <Link key={category.id} href={`${shopHref}?category=${category.slug}`}>{localize(category.name, locale)}</Link>
        ))}
      </nav>
    </header>
  );
}
