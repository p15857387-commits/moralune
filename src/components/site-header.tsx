import Link from "next/link";
import { LanguageSwitch } from "./language-switch";
import { SelectionLink } from "./selection-link";
import { MobileMenu } from "./mobile-menu";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";
import { brand } from "@/lib/brand";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = t(locale);
  return (
    <header className="site-header">
      <div className="announcement"><span>{locale === "zh-CN" ? "为日常，选一点刚刚好的美" : "A little beauty, chosen for everyday living"}</span></div>
      <div className="header-inner">
        <Link className="wordmark ml-wordmark" href={`/${locale}`} aria-label={brand.zh}>
          <span className="brand-logo-window"><img src="/moralune-wordmark.png" alt={brand.zh} /></span>
          <small>{brand.en}</small>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href={`/${locale}/shop`}>{copy.shop}</Link><Link href={`/${locale}#edit`}>{locale === "zh-CN" ? "本期主题" : "The Edit"}</Link><Link href={`/${locale}/about`}>{copy.about}</Link>
        </nav>
        <div className="header-actions"><LanguageSwitch locale={locale} /><SelectionLink locale={locale} label={copy.selection} compact /><MobileMenu locale={locale} shop={copy.shop} edit={locale === "zh-CN" ? "本期主题" : "The Edit"} about={copy.about} selection={copy.selection} /></div>
      </div>
    </header>
  );
}
