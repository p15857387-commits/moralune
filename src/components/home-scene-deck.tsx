"use client";

import { useEffect, type ReactNode } from "react";

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-offset");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function scenes() {
  return [...document.querySelectorAll<HTMLElement>("[data-scene]")];
}

function nearestIndex() {
  const list = scenes();
  const marker = window.scrollY + headerOffset() + 24;
  let current = 0;
  list.forEach((node, index) => {
    if (node.offsetTop <= marker) current = index;
  });
  return { list, current };
}

function go(delta: number) {
  const { list, current } = nearestIndex();
  const next = Math.max(0, Math.min(list.length - 1, current + delta));
  if (next === current) return;
  list[next].scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Full-bleed homepage scenes. Click, swipe-snap, or arrow keys move between them. */
export function HomeSceneDeck({ children }: { children: ReactNode }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="scene-deck"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a, button")) return;
        if (!target.closest("[data-scene]")) return;
        go(1);
      }}
    >
      {children}
    </div>
  );
}
