"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/types";

export function MobileMenu({ locale, shop, edit, about, selection }: { locale: Locale; shop: string; edit: string; about: string; selection: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      {open && (
        <div className="mobile-menu">
          <p>{locale === "zh-CN" ? "为日常，选一点刚刚好的美。" : "A little beauty, chosen for everyday living."}</p>
          <nav aria-label="Mobile navigation">
            <Link href={`/${locale}`} onClick={() => setOpen(false)}>{locale === "zh-CN" ? "首页" : "Home"}<span>01</span></Link>
            <Link href={`/${locale}/shop`} onClick={() => setOpen(false)}>{shop}<span>02</span></Link>
            <Link href={`/${locale}#edit`} onClick={() => setOpen(false)}>{edit}<span>03</span></Link>
            <Link href={`/${locale}/about`} onClick={() => setOpen(false)}>{about}<span>04</span></Link>
            <Link href={`/${locale}/selection`} onClick={() => setOpen(false)}>{selection}<span>05</span></Link>
          </nav>
        </div>
      )}
    </>
  );
}
