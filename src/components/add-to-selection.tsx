"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useSelectionStore } from "@/store/selection";

export function AddToSelection({ productId, label, disabled = false, quantity = 1, compact = false }: { productId: string; label: string; disabled?: boolean; quantity?: number; compact?: boolean }) {
  const add = useSelectionStore((state) => state.add);
  const [added, setAdded] = useState(false);
  const addedLabel = label === "加入清单" || label === "加入" ? "已加入" : "Added";
  return (
    <button className={compact ? "add-button add-button-compact" : "add-button"} type="button" disabled={disabled} onClick={() => { add(productId, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1600); }}>
      {added ? <Check size={compact ? 14 : 18} /> : <Plus size={compact ? 14 : 18} />} {added ? addedLabel : label}
    </button>
  );
}
