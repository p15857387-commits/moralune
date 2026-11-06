import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";

const pages = {
  shipping: {
    en: "Shipping & Returns",
    zh: "配送与退换",
    enBody: "Shipping times, regions, and returns will be confirmed with each inquiry. This page is a placeholder until those details are published.",
    zhBody: "配送时效、地区与退换，会在每次选物意向里一并确认。正式说明发布前，此页为占位。",
  },
  care: {
    en: "Care",
    zh: "养护",
    enBody: "Each object carries its own care note on the product page. A longer care guide will live here later.",
    zhBody: "每件器物的养护写在商品页上。更完整的养护说明以后会放在这里。",
  },
  contact: {
    en: "Contact",
    zh: "联系",
    enBody: "For an object, a delivery question, or a trade note, send a selection inquiry from your list. A studio address will be added here.",
    zhBody: "想问一件器物、配送或合作，请从选物清单提交意向。工作室地址以后会写在这里。",
  },
  privacy: {
    en: "Privacy",
    zh: "隐私",
    enBody: "Inquiry details are used only to reply about the objects you asked for. A full privacy note will replace this placeholder.",
    zhBody: "意向里的联系方式只用于回复你询问的器物。完整隐私说明会替换这段占位文字。",
  },
  terms: {
    en: "Terms",
    zh: "条款",
    enBody: "Prices on the site are indicative until an inquiry or an external purchase page confirms them. Full terms will replace this placeholder.",
    zhBody: "站内价格在意向确认或外部购买页确认前均为参考。完整条款会替换这段占位文字。",
  },
} as const;

type Slug = keyof typeof pages;
const slugs = Object.keys(pages) as Slug[];
const isSlug = (value: string): value is Slug => slugs.includes(value as Slug);

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isSlug(slug)) return {};
  const page = pages[slug];
  return { title: locale === "zh-CN" ? page.zh : page.en };
}

export default async function StaticPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isSlug(slug)) notFound();
  const page = pages[slug];
  const zh = locale === "zh-CN";
  return (
    <article className="static-page page-shell">
      <p className="eyebrow">{zh ? "帮助" : "Help"}</p>
      <h1>{zh ? page.zh : page.en}</h1>
      <p>{zh ? page.zhBody : page.enBody}</p>
      <Link className="text-link" href={`/${locale}/shop`}>{zh ? "返回选物" : "Back to shop"}</Link>
    </article>
  );
}
