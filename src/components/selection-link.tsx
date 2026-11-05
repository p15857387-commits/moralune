"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useSelectionStore } from "@/store/selection";
import type { Locale } from "@/types";

export function SelectionLink({ locale, label, compact = false }: { locale: Locale; label: string; compact?: boolean }) {
  const count = useSelectionStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  return (
    <Link className={compact ? "selection-link compact" : "selection-link"} href={`/${locale}/selection`} aria-label={`${label} ${count}`}>
      <ShoppingBag size={18} strokeWidth={1.6} /><span className="selection-label">{label}</span>
      {count > 0 && <span className="selection-count">{count}</span>}
    </Link>
  );
}
