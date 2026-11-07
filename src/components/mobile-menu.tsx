"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

export function MobileMenu({ locale, links }: { locale: Locale; links: { href: string; label: string; kind?: "category" }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      {open && (
        <div className="mobile-menu">
          <p>{t(locale).footerNote}</p>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <Link key={link.href + link.label} href={link.href} className={link.kind === "category" ? "mobile-category" : undefined} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
