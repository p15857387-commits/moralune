"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Locale, Product } from "@/types";

export function ProductStrip({ products, locale, previousLabel, nextLabel }: { products: Product[]; locale: Locale; previousLabel: string; nextLabel: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const move = (direction: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollBy({ left: direction * Math.min(scroller.clientWidth * 0.8, 380), behavior: reduce ? "auto" : "smooth" });
  };

  if (products.length === 0) {
    return <div className="product-grid-empty" role="status">{locale === "en" ? "This edit is taking shape. New objects are on their way." : "这个分类正在整理中，更多精选即将上架。"}</div>;
  }

  return (
    <div className="product-strip-wrap">
      <button className="strip-arrow strip-arrow-prev" type="button" aria-label={previousLabel} onClick={() => move(-1)}><ArrowLeft size={18} /></button>
      <div className="product-strip" ref={scrollerRef} tabIndex={0} aria-label={locale === "zh-CN" ? "本期精选" : "The edit"}>
        {products.map((product, index) => <ProductCard key={product.id} product={product} locale={locale} index={index} />)}
      </div>
      <button className="strip-arrow strip-arrow-next" type="button" aria-label={nextLabel} onClick={() => move(1)}><ArrowRight size={18} /></button>
    </div>
  );
}
