"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types";

export function languageSwitchHref(pathname: string, locale: Locale) {
  const nextLocale = locale === "zh-CN" ? "en" : "zh-CN";
  return pathname.replace(/^\/(zh-CN|en)/, `/${nextLocale}`);
}

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const hrefFor = (next: Locale) => pathname.replace(/^\/(zh-CN|en)/, `/${next}`) || `/${next}`;
  return (
    <nav className="language-switch" aria-label={locale === "zh-CN" ? "语言" : "Language"}>
      <Link href={hrefFor("en")} lang="en" aria-label="Switch to English" aria-current={locale === "en" ? "page" : undefined}>EN</Link>
      <span aria-hidden="true">/</span>
      <Link href={hrefFor("zh-CN")} lang="zh-CN" aria-label="切换到中文" aria-current={locale === "zh-CN" ? "page" : undefined}>中</Link>
    </nav>
  );
}
