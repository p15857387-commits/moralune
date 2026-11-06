"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AddToSelection } from "./add-to-selection";
import { indexAfterCoast, nearestIndex } from "@/lib/look-scroll";
import type { Locale } from "@/types";

export type RoomLookProduct = {
  id: string;
  slug: string;
  name: string;
  priceLabel: string;
  image: string;
  available: boolean;
};

export type RoomLook = {
  id: string;
  poster: string;
  videoSrc?: string;
  title: string;
  note: string;
  alt: string;
  products: RoomLookProduct[];
};

type Props = {
  looks: RoomLook[];
  locale: Locale;
  addLabel: string;
  viewLabel: string;
  title: string;
  lede: string;
  eyebrow: string;
  panelLabel: string;
  emptyLabel: string;
};

export function RoomLookShowcase({ looks, locale, addLabel, viewLabel, title, lede, eyebrow, panelLabel, emptyLabel }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const frame = useRef<number | null>(null);
  const reduced = useRef(false);
  const drag = useRef({ pointer: -1, startX: 0, startScroll: 0, lastX: 0, lastT: 0, velocity: 0, moved: false });
  const [active, setActive] = useState(0);

  const centers = useCallback(() => slideRefs.current.map((slide) => (slide ? slide.offsetLeft + slide.offsetWidth / 2 : 0)), []);

  const readActive = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const next = nearestIndex(centers(), scroller.scrollLeft + scroller.clientWidth / 2);
    setActive((current) => (current === next ? current : next));
  }, [centers]);

  const stopFrame = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const centerOf = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    const slide = slideRefs.current[index];
    if (!scroller || !slide) return null;
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const left = slide.offsetLeft + slide.offsetWidth / 2 - scroller.clientWidth / 2;
    return Math.max(0, Math.min(max, left));
  }, []);

  const animateTo = useCallback((target: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    stopFrame();
    if (reduced.current) {
      scroller.scrollLeft = target;
      scroller.classList.remove("is-settling");
      return;
    }
    scroller.classList.add("is-settling");
    const start = scroller.scrollLeft;
    const delta = target - start;
    const duration = 520;
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      scroller.scrollLeft = start + delta * eased;
      if (t < 1) frame.current = requestAnimationFrame(step);
      else {
        frame.current = null;
        scroller.classList.remove("is-settling");
      }
    };
    frame.current = requestAnimationFrame(step);
  }, [stopFrame]);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollerRef.current;
    const left = centerOf(index);
    if (!scroller || left === null) return;
    const next = Math.max(0, Math.min(looks.length - 1, index));
    setActive(next);
    if (reduced.current || behavior === "auto") {
      stopFrame();
      scroller.classList.remove("is-settling");
      scroller.scrollLeft = left;
      return;
    }
    scroller.scrollTo({ left, behavior: "smooth" });
  }, [centerOf, looks.length, stopFrame]);

  useLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const left = centerOf(0);
    if (scrollerRef.current && left !== null) scrollerRef.current.scrollLeft = left;
  }, [centerOf]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (drag.current.pointer !== -1 || scroller.classList.contains("is-settling")) return;
        readActive();
      });
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [readActive]);

  useEffect(() => () => stopFrame(), [stopFrame]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    stopFrame();
    scroller.classList.remove("is-settling");
    scroller.classList.add("is-dragging");
    scroller.setPointerCapture(event.pointerId);
    drag.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      startScroll: scroller.scrollLeft,
      lastX: event.clientX,
      lastT: performance.now(),
      velocity: 0,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || drag.current.pointer !== event.pointerId) return;
    const now = performance.now();
    const dx = event.clientX - drag.current.lastX;
    const dt = Math.max(now - drag.current.lastT, 1);
    drag.current.velocity = -dx / dt;
    drag.current.lastX = event.clientX;
    drag.current.lastT = now;
    if (Math.abs(event.clientX - drag.current.startX) > 4) drag.current.moved = true;
    scroller.scrollLeft = drag.current.startScroll - (event.clientX - drag.current.startX);
    readActive();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || drag.current.pointer !== event.pointerId) return;
    const velocity = drag.current.velocity;
    const moved = drag.current.moved;
    drag.current.pointer = -1;
    scroller.classList.remove("is-dragging");
    if (!moved) {
      const index = slideRefs.current.findIndex((slide) => {
        if (!slide) return false;
        const box = slide.getBoundingClientRect();
        return event.clientX >= box.left && event.clientX <= box.right;
      });
      if (index >= 0) scrollToIndex(index);
      return;
    }
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const index = indexAfterCoast(centers(), scroller.scrollLeft, scroller.clientWidth, velocity, max);
    const left = centerOf(index);
    setActive(index);
    if (left !== null) animateTo(left);
    window.setTimeout(() => { drag.current.moved = false; }, 50);
  };

  if (!looks.length) return null;
  const look = looks[Math.min(active, looks.length - 1)];
  const zh = locale === "zh-CN";

  return (
    <section className="room-showcase" id="shop-the-room" aria-roledescription="carousel" aria-label={title}>
      <div className="room-showcase-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p>{lede}</p>
      </div>
      <div className="room-showcase-layout">
        <div className="room-look-stage">
          <div
            className="room-look-scroller"
            ref={scrollerRef}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") { event.preventDefault(); scrollToIndex(Math.min(looks.length - 1, active + 1)); }
              if (event.key === "ArrowLeft") { event.preventDefault(); scrollToIndex(Math.max(0, active - 1)); }
            }}
          >
            <div className="room-look-spacer" aria-hidden="true" />
            {looks.map((item, index) => (
              <article
                key={item.id}
                ref={(node) => { slideRefs.current[index] = node; }}
                className={`room-look-slide${index === active ? " is-active" : ""}`}
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${looks.length}. ${item.title}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => { if (drag.current.moved) return; scrollToIndex(index); }}
              >
                <LookMedia look={item} active={index === active} priority={index === 0} />
                <p>{item.title}</p>
              </article>
            ))}
            <div className="room-look-spacer" aria-hidden="true" />
          </div>
          <button className="room-look-arrow is-prev" type="button" aria-label={zh ? "上一间" : "Previous room"} onClick={() => scrollToIndex(Math.max(0, active - 1))} disabled={active === 0}><ArrowLeft size={18} /></button>
          <button className="room-look-arrow is-next" type="button" aria-label={zh ? "下一间" : "Next room"} onClick={() => scrollToIndex(Math.min(looks.length - 1, active + 1))} disabled={active === looks.length - 1}><ArrowRight size={18} /></button>
        </div>
        <aside className="room-look-panel">
          <p className="room-look-live" aria-live="polite">{look.title}. {panelLabel} {String(active + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}</p>
          <div className="room-look-panel-body" key={look.id}>
            <p className="room-look-index"><span>{panelLabel}</span><span>{String(active + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}</span></p>
            <h3>{look.title}</h3>
            <p className="room-look-note">{look.note}</p>
            {look.products.length === 0 ? <p className="room-look-note">{emptyLabel}</p> : (
              <ul className="room-look-products">
                {look.products.map((product) => (
                  <li key={product.id}>
                    <Link className="room-look-thumb" href={`/${locale}/products/${product.slug}`}>
                      <Image src={product.image} alt="" fill sizes="96px" />
                    </Link>
                    <div className="room-look-copy">
                      <Link className="room-look-name" href={`/${locale}/products/${product.slug}`}>{product.name}</Link>
                      <span className="room-look-price">{product.priceLabel}</span>
                      <div className="room-look-actions">
                        <AddToSelection productId={product.id} label={addLabel} disabled={!product.available} compact />
                        <Link className="room-look-view" href={`/${locale}/products/${product.slug}`}>{viewLabel}<ArrowUpRight size={14} /></Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function LookMedia({ look, active, priority }: { look: RoomLook; active: boolean; priority: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active && !reduce) {
      const play = video.play();
      if (play) play.catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active]);

  if (look.videoSrc) {
    return (
      <video ref={videoRef} className="room-look-media" poster={look.poster} muted loop playsInline preload="metadata">
        <source src={look.videoSrc} />
      </video>
    );
  }

  return (
    <Image
      className={`room-look-media room-look-still${active ? " is-alive" : ""}`}
      src={look.poster}
      alt={look.alt}
      fill
      sizes="(max-width: 860px) 84vw, 42vw"
      draggable={false}
      priority={priority}
    />
  );
}
