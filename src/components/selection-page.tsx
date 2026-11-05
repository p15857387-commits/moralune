"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { products } from "@/data/catalog";
import { displayName, formatPrice } from "@/lib/catalog";
import { useSelectionStore } from "@/store/selection";
import type { Locale } from "@/types";

export function SelectionPage({ locale, paypalEnabled, paypalPriceIds }: { locale: Locale; paypalEnabled: boolean; paypalPriceIds: string[] }) {
  const router = useRouter();
  const zh = locale === "zh-CN";
  const { items, setQuantity, remove, clear } = useSelectionStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const selected = useMemo(
    () => items.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter((item) => item.product),
    [items],
  );
  const total = selected.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);
  const hasUnavailable = selected.some((item) => !item.product!.available);
  const hasUsdPrices = selected.every((item) => paypalPriceIds.includes(item.product!.id));

  async function checkout() {
    setCheckoutLoading(true);
    setError("");
    try {
      const response = await fetch("/api/paypal/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, locale }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (zh ? "无法创建 PayPal 结账，请稍后重试。" : "Could not create PayPal checkout. Please try again."));
      window.location.assign(data.approvalUrl);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Request failed");
      setCheckoutLoading(false);
    }
  }

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload = { name: formData.get("name"), email: formData.get("email"), region: formData.get("region"), notes: formData.get("notes"), locale, items };
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (zh ? "提交失败，请稍后重试。" : "Could not submit. Please try again."));
      clear();
      router.push(`/${locale}/success/${data.reference}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Request failed");
      setLoading(false);
    }
  }

  if (selected.length === 0) {
    return (
      <div className="selection-page page-shell">
        <header className="page-intro">
          <p className="eyebrow">{zh ? "你的选品清单" : "YOUR SELECTION"}</p>
          <h1>{zh ? "先去遇见一件喜欢的物品。" : "Begin with an object you love."}</h1>
          <p>{zh ? "浏览商品后，把喜欢的款式加入这里。" : "Browse the collection and keep your favourites here."}</p>
          <Link className="button dark" href={`/${locale}/shop`}>{zh ? "浏览选品" : "Browse collection"}</Link>
        </header>
      </div>
    );
  }

  return (
    <div className="selection-page page-shell">
      <Link className="back-link" href={`/${locale}/shop`}><ArrowLeft size={16} />{zh ? "继续浏览" : "Continue browsing"}</Link>
      <header className="selection-heading">
        <div>
          <p className="eyebrow">{zh ? "你的选品清单" : "YOUR SELECTION"}</p>
          <h1>{zh ? "一起确认这些日常小物。" : "Let’s review your chosen objects."}</h1>
        </div>
        <button className="clear-button" onClick={clear}>{zh ? "清空清单" : "Clear all"}</button>
      </header>
      <div className="selection-layout">
        <section className="selection-items">
          {selected.map(({ product, quantity }) => (
            <article className={!product!.available ? "selection-item unavailable" : "selection-item"} key={product!.id}>
              <div className="selection-thumb"><Image src={product!.image!} alt={displayName(product!.name, locale)} fill sizes="120px" /></div>
              <div className="selection-item-copy">
                <div>
                  <h2>{displayName(product!.name, locale)}</h2>
                  <p>{formatPrice(product!.price, locale)}</p>
                  {!product!.available && <strong>{zh ? "暂时缺货，请移除后再提交。" : "Currently unavailable. Remove before submitting."}</strong>}
                </div>
                <div className="item-actions">
                  <div className="quantity-control">
                    <button onClick={() => setQuantity(product!.id, quantity - 1)} aria-label="Decrease"><Minus size={14} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(product!.id, quantity + 1)} aria-label="Increase"><Plus size={14} /></button>
                  </div>
                  <button className="icon-button" onClick={() => remove(product!.id)} aria-label="Remove"><Trash2 size={17} /></button>
                </div>
              </div>
              <span className="line-price">{formatPrice(product!.price * quantity, locale)}</span>
            </article>
          ))}
        </section>
        <aside className="inquiry-card">
          <div className="inquiry-summary">
            <span>{zh ? "参考合计" : "Indicative total"}</span>
            <strong>{formatPrice(total, locale)}</strong>
          </div>
          <p>{zh ? "通过 PayPal 在安全结账页完成付款。本站展示的人民币为参考价，PayPal 将使用已确认的美元售价。" : "Pay securely with PayPal. CNY prices shown here are indicative; checkout uses MORALUNE’s confirmed USD prices."}</p>
          <button className="button dark submit-button" disabled={!paypalEnabled || !hasUsdPrices || checkoutLoading || loading || hasUnavailable} onClick={checkout}>
            {checkoutLoading && <LoaderCircle className="spin" size={17} />}
            {checkoutLoading ? (zh ? "正在前往 PayPal" : "Opening PayPal") : (zh ? "通过 PayPal 安全付款" : "Pay securely with PayPal")}
          </button>
          {(!paypalEnabled || !hasUsdPrices) && <p className="form-hint">{zh ? "PayPal 直连将在配置商户凭据、美元售价及配送税费规则后启用。你仍可先提交选品意向。" : "Direct PayPal checkout will activate after merchant credentials, USD prices, and shipping and tax rules are confirmed. You can still send an inquiry."}</p>}
          <div className="inquiry-divider"><span>{zh ? "或" : "or"}</span></div>
          <p>{zh ? "如果想先确认库存、配送或批量购买，可继续提交选品意向。" : "If you want to confirm availability, delivery or bulk details first, send a selection inquiry."}</p>
          <form action={submit}>
            <label>{zh ? "你的姓名" : "Your name"}<input name="name" required minLength={2} placeholder={zh ? "怎么称呼你" : "How should we address you?"} /></label>
            <label>{zh ? "邮箱" : "Email"}<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>{zh ? "所在地区" : "Region"}<input name="region" required minLength={2} placeholder={zh ? "城市 / 国家或地区" : "City / Country or region"} /></label>
            <label>{zh ? "备注（选填）" : "Notes (optional)"}<textarea name="notes" maxLength={1200} rows={4} placeholder={zh ? "配送时间、数量或其他想法" : "Timing, quantities, or anything else"} /></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button submit-button" disabled={loading || checkoutLoading || hasUnavailable}>
              {loading && <LoaderCircle className="spin" size={17} />}
              {loading ? (zh ? "正在提交" : "Submitting") : (zh ? "提交选品意向" : "Send selection inquiry")}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
