"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useSelectionStore } from "@/store/selection";
import type { Locale } from "@/types";

export function PaymentConfirmation({ locale, reference }: { locale: Locale; reference: string }) {
  const clear = useSelectionStore((state) => state.clear);
  const zh = locale === "zh-CN";
  useEffect(() => { clear(); }, [clear]);

  return <div className="success-page page-shell"><div className="success-icon"><Check /></div><p className="eyebrow">{zh ? "PAYPAL 付款完成" : "PAYMENT COMPLETE"}</p><h1>{zh ? "谢谢，订单已付款。" : "Thank you. Your payment is complete."}</h1><p>{zh ? "PayPal 已确认这笔付款。请保存下方订单编号以便查询。" : "PayPal confirmed your payment. Keep the order reference below for your records."}</p><div className="reference"><span>{zh ? "PAYPAL 订单编号" : "PAYPAL ORDER"}</span><strong>{reference}</strong></div><Link className="button dark" href={`/${locale}/shop`}>{zh ? "继续浏览" : "Continue browsing"}</Link></div>;
}
