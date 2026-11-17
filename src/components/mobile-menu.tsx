"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

export function MobileMenu({ locale, links }: { locale: Locale; links: { href: string; label: string; kind?: "category" }[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => (panel ? [...panel.querySelectorAll<HTMLElement>("a, button")] : []);
    focusable()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className="menu-button"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => (open ? close(false) : setOpen(true))}
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      {open && (
        <div className="mobile-menu" id="mobile-navigation" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div ref={panelRef} className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label={locale === "zh-CN" ? "菜单" : "Menu"}>
            <button className="menu-close" type="button" aria-label={locale === "zh-CN" ? "关闭菜单" : "Close menu"} onClick={() => close()}>
              <X size={21} />
            </button>
            <p>{t(locale).footerNote}</p>
            <nav aria-label="Mobile navigation">
              {links.map((link) => (
                <Link key={link.href + link.label} href={link.href} className={link.kind === "category" ? "mobile-category" : undefined} onClick={() => close(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
