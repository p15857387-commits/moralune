import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/types";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-cta page-shell"><p>{locale === "zh-CN" ? "让喜欢的东西，慢慢成为生活的一部分。" : "Let what you love become part of everyday life."}</p><Link className="footer-cta-link" href={`/${locale}/shop`}>{locale === "zh-CN" ? "浏览本期选物" : "Explore the collection"}<ArrowUpRight size={22} /></Link></div>
      <div className="footer-main page-shell">
        <div className="footer-brand"><div className="footer-mark"><img src="/moralune-wordmark.png" alt="MORALUNE" /></div><p>{locale === "zh-CN" ? "为日常，选一点刚刚好的美。" : "A little beauty, chosen for everyday living."}</p></div>
        <div className="footer-links"><span>{locale === "zh-CN" ? "探索" : "EXPLORE"}</span><Link href={`/${locale}/shop`}>{locale === "zh-CN" ? "全部选物" : "Shop all"}</Link><Link href={`/${locale}/about`}>{locale === "zh-CN" ? "关于 MORALUNE" : "Our story"}</Link><Link href={`/${locale}/selection`}>{locale === "zh-CN" ? "选品清单" : "Selection"}</Link></div>
        <div className="footer-news"><span>{locale === "zh-CN" ? "日常来信" : "NOTES FOR LIVING"}</span><p>{locale === "zh-CN" ? "偶尔来信，分享新物与生活灵感。" : "Occasional notes on new finds and everyday inspiration."}</p><div className="newsletter"><input aria-label={locale === "zh-CN" ? "你的邮箱" : "Your email"} placeholder={locale === "zh-CN" ? "你的邮箱" : "Your email"} /><button aria-label={locale === "zh-CN" ? "订阅" : "Subscribe"}><ArrowUpRight size={18} /></button></div></div>
      </div>
      <div className="footer-bottom page-shell"><span>© {new Date().getFullYear()} MORALUNE</span><span>{locale === "zh-CN" ? "隐私政策 · 使用条款" : "Privacy · Terms"}</span></div>
    </footer>
  );
}
