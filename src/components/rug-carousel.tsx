"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { formatPrice, localize } from "@/lib/catalog";
import type { Locale, Product } from "@/types";

const cutouts: Record<string, string> = {
  "indigo-tide-rug": "/images/products/cutouts/indigo-tide-rug.png",
  "ochre-field-kilim": "/images/products/cutouts/ochre-field-kilim.png",
  "pebble-arc-rug": "/images/products/cutouts/pebble-arc-rug.png",
  "dune-chorus-rug": "/images/products/cutouts/dune-chorus-rug.png",
  "verdant-field-rug": "/images/products/cutouts/verdant-field-rug.png",
  "midnight-current-runner": "/images/products/cutouts/midnight-current-runner.png",
};

export function RugCarousel({ products, locale }: { products: Product[]; locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const startX = useRef<number | null>(null);
  const dragged = useRef(false);
  const product = products[selected];
  const count = products.length;
  const move = (step: number) => setSelected((current) => (current + step + count) % count);
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  };

  if (!count) return null;

  return (
    <section className="rug-experience" aria-label={locale === "zh-CN" ? "地毯互动浏览" : "Interactive rug collection"}>
      <div className="rug-stage-heading">
        <span>{locale === "zh-CN" ? "作品 01—06" : "OBJECTS 01—06"}</span>
        <p>{locale === "zh-CN" ? "拖动或使用箭头，浏览系列作品" : "Drag to explore the collection"}</p>
      </div>
      <div
        className="rug-stage"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => { startX.current = event.clientX; }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const delta = event.clientX - startX.current;
          if (Math.abs(delta) > 42) {
            dragged.current = true;
            move(delta < 0 ? 1 : -1);
            window.setTimeout(() => { dragged.current = false; }, 0);
          }
          startX.current = null;
        }}
        onPointerCancel={() => { startX.current = null; }}
      >
        <span className="rug-stage-index">{String(selected + 1).padStart(2, "0")} <i>/</i> {String(count).padStart(2, "0")}</span>
        <div className="rug-stage-rule" />
        <div className="rug-carousel-track" aria-live="polite">
          {products.map((item, index) => {
            const raw = index - selected;
            const offset = raw > count / 2 ? raw - count : raw < -count / 2 ? raw + count : raw;
            const distance = Math.abs(offset);
            const style = {
              "--rug-position": offset,
              "--rug-shift": `${offset * 30}vw`,
              "--rug-scale": distance === 0 ? 1 : distance === 1 ? 0.72 : 0.46,
              "--rug-opacity": distance > 2 ? 0 : distance === 2 ? 0.45 : distance === 1 ? 0.72 : 1,
              "--rug-z": 5 - distance,
            } as React.CSSProperties;
            return (
              <button
                className={`rug-carousel-item${index === selected ? " is-selected" : ""}`}
                style={style}
                key={item.id}
                type="button"
                aria-label={`${locale === "zh-CN" ? "查看" : "View"} ${localize(item.name, locale)}`}
                aria-pressed={index === selected}
                onClick={() => { if (dragged.current) return; setSelected(index); }}
              >
                <Image src={cutouts[item.id] ?? item.image!} alt={localize(item.name, locale)} fill sizes="(max-width: 760px) 78vw, 48vw" priority={index === selected} draggable={false} />
              </button>
            );
          })}
        </div>
        <button className="rug-arrow rug-arrow-prev" type="button" onClick={() => { if (dragged.current) return; move(-1); }} aria-label={locale === "zh-CN" ? "上一款地毯" : "Previous rug"}><ArrowLeft size={18} /></button>
        <button className="rug-arrow rug-arrow-next" type="button" onClick={() => { if (dragged.current) return; move(1); }} aria-label={locale === "zh-CN" ? "下一款地毯" : "Next rug"}><ArrowRight size={18} /></button>
        <div className="rug-stage-hint">{locale === "zh-CN" ? "拖动以旋转浏览" : "DRAG TO ROTATE"}</div>
      </div>
      <div className="rug-caption-row" key={product.id}>
        <div className="rug-caption-index"><span>{locale === "zh-CN" ? "当前作品" : "NOW SHOWING"}</span><span>{String(selected + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span></div>
        <div className="rug-caption-main"><h2>{localize(product.name, locale)}</h2><p>{localize(product.description ?? { "zh-CN": "", en: "" }, locale)}</p></div>
        <div className="rug-caption-action"><span>{formatPrice(product.price, locale)}</span><Link href={`/${locale}/products/${product.slug}`}>{locale === "zh-CN" ? "查看作品" : "VIEW OBJECT"}<ArrowUpRight size={15} /></Link></div>
      </div>
      <div className="rug-picker" aria-label={locale === "zh-CN" ? "选择地毯" : "Choose a rug"}>
        {products.map((item, index) => (
          <button key={item.id} className={`rug-picker-item${index === selected ? " is-selected" : ""}`} type="button" onClick={() => setSelected(index)} aria-label={localize(item.name, locale)} aria-current={index === selected ? "true" : undefined}>
            <span>{String(index + 1).padStart(2, "0")}</span><span>{localize(item.name, locale)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
