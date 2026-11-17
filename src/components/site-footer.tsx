import Link from "next/link";
import { wordmarks } from "@/lib/brand";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

const helpLinks = [
  { slug: "shipping", en: "Shipping & Returns", zh: "配送与退换" },
  { slug: "care", en: "Care", zh: "养护" },
  { slug: "contact", en: "Contact", zh: "联系" },
  { slug: "privacy", en: "Privacy", zh: "隐私" },
  { slug: "terms", en: "Terms", zh: "条款" },
];

export function SiteFooter({ locale }: { locale: Locale }) {
  const zh = locale === "zh-CN";
  const copy = t(locale);
  return (
    <footer className="site-footer">
      <div className="footer-main page-shell">
        <div className="footer-brand">
          <div className="footer-mark"><img src={wordmarks.light} alt="MORALUNE" /></div>
          <p>{copy.footerNote}</p>
        </div>
        <div className="footer-links">
          <span>{zh ? "品牌" : "House"}</span>
          <Link href={`/${locale}/shop`}>{copy.collection}</Link>
          <Link href={`/${locale}/about`}>{copy.about}</Link>
          <Link href={`/${locale}/selection`}>{copy.selection}</Link>
        </div>
        <div className="footer-links">
          <span>{zh ? "帮助" : "Help"}</span>
          {helpLinks.map((link) => (
            <Link key={link.slug} href={`/${locale}/pages/${link.slug}`}>{zh ? link.zh : link.en}</Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <span>© {new Date().getFullYear()} MORALUNE</span>
        <span>{copy.footerSign}</span>
      </div>
    </footer>
  );
}
