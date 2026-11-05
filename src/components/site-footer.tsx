import Link from "next/link";
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
  return (
    <footer className="site-footer">
      <div className="footer-main page-shell">
        <div className="footer-brand">
          <div className="footer-mark"><img src="/moralune-wordmark.png" alt="MORALUNE" /></div>
          <p>{zh ? "为日常，选一点刚刚好的美。" : "A little beauty, chosen for everyday living."}</p>
        </div>
        <div className="footer-links">
          <span>{zh ? "探索" : "Explore"}</span>
          <Link href={`/${locale}/shop`}>{zh ? "全部选物" : "Shop"}</Link>
          <Link href={`/${locale}/about`}>{zh ? "关于" : "About"}</Link>
          <Link href={`/${locale}/selection`}>{zh ? "选物清单" : "Selection"}</Link>
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
        <span>{zh ? "月光一样的日常器物" : "Objects for everyday living"}</span>
      </div>
    </footer>
  );
}
