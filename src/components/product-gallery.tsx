"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ProductImage } from "@/types";

export function ProductGallery({
  frames,
  alt,
  badge,
  emptyLabel = "No matching supplier photo for this piece.",
}: {
  frames: ProductImage[];
  alt: string;
  badge: { label: string; available: boolean; preview: boolean };
  emptyLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const current = frames[active] ?? frames[0];
  const pillClass = badge.available ? "status-pill is-available" : badge.preview ? "status-pill is-preview" : "status-pill";
  const multiple = frames.length > 1;

  function step(delta: number) {
    if (!multiple) return;
    setActive((value) => (value + delta + frames.length) % frames.length);
  }

  useEffect(() => {
    if (!multiple) return;
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [multiple, frames.length]);

  return (
    <div className="product-gallery">
      <div className="product-detail-image">
        {current ? (
          <Image src={current.src} alt={alt} fill priority sizes="(max-width: 850px) 100vw, 58vw" unoptimized={current.src.startsWith("/products/v2/")} />
        ) : (
          <p className="photo-fallback">{emptyLabel}</p>
        )}
        <span className={pillClass}>{badge.label}</span>
        {multiple && (
          <>
            <button className="gallery-arrow is-prev" type="button" aria-label="Previous image" onClick={() => step(-1)}><ArrowLeft size={18} /></button>
            <button className="gallery-arrow is-next" type="button" aria-label="Next image" onClick={() => step(1)}><ArrowRight size={18} /></button>
          </>
        )}
      </div>
      {frames.length > 1 && (
        <div className="product-thumbs">
          {frames.map((frame, index) => (
            <button
              key={frame.src}
              type="button"
              aria-label={`${alt} ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <Image src={frame.src} alt="" fill sizes="72px" unoptimized={frame.src.startsWith("/products/v2/")} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
