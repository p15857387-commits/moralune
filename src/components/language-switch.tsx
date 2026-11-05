"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale = locale === "zh-CN" ? "en" : "zh-CN";
  const href = pathname.replace(/^\/(zh-CN|en)/, `/${nextLocale}`);
  return <Link className="language-switch" href={href} aria-label={locale === "zh-CN" ? "Switch to English" : "切换到中文"}>{locale === "zh-CN" ? "EN" : "中"}</Link>;
}
