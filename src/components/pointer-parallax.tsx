"use client";

import type { PointerEvent, ReactNode } from "react";

type PointerParallaxProps = {
  as?: "div" | "section";
  className: string;
  id?: string;
  ariaLabel?: string;
  children: ReactNode;
};

export function PointerParallax({ as = "div", className, id, ariaLabel, children }: PointerParallaxProps) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--moralune-parallax-x", `${(-x * 18).toFixed(2)}px`);
    event.currentTarget.style.setProperty("--moralune-parallax-y", `${(-y * 12).toFixed(2)}px`);
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--moralune-parallax-x", "0px");
    event.currentTarget.style.setProperty("--moralune-parallax-y", "0px");
  }

  const props = { className, id, "aria-label": ariaLabel, onPointerMove: handlePointerMove, onPointerLeave: handlePointerLeave };
  return as === "section" ? <section {...props}>{children}</section> : <div {...props}>{children}</div>;
}
