import Link from "next/link";
import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
export default async function SuccessPage({ params }: { params: Promise<{ locale: string; reference: string }> }) { const { locale, reference } = await params; if (!isLocale(locale)) notFound(); const zh = locale === "zh-CN"; return <div className="success-page page-shell"><div className="success-icon"><Check /></div><p className="eyebrow">{zh ? "已收到你的选品" : "SELECTION RECEIVED"}</p><h1>{zh ? "谢谢，让我们接着聊。" : "Thank you. We’ll take it from here."}</h1><p>{zh ? "确认邮件正在发送。我们会核对库存与配送方式，并尽快回复你。" : "A confirmation email is on its way. We’ll review availability and delivery, then get back to you shortly."}</p><div className="reference"><span>{zh ? "意向编号" : "REFERENCE"}</span><strong>{reference}</strong></div><Link className="button dark" href={`/${locale}/shop`}>{zh ? "继续浏览" : "Continue browsing"}</Link></div>; }
