"use client";

import { useState } from "react";
import Image from "next/image";
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

  return (
    <div className="product-gallery">
      <div className="product-detail-image">
        {current ? (
          <Image src={current.src} alt={alt} fill priority sizes="(max-width: 850px) 100vw, 58vw" />
        ) : (
          <p className="photo-fallback">{emptyLabel}</p>
        )}
        <span className={pillClass}>{badge.label}</span>
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
              <Image src={frame.src} alt="" fill sizes="72px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
