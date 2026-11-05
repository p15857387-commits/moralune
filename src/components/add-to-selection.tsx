"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useSelectionStore } from "@/store/selection";

export function AddToSelection({ productId, label, disabled = false, quantity = 1 }: { productId: string; label: string; disabled?: boolean; quantity?: number }) {
  const add = useSelectionStore((state) => state.add);
  const [added, setAdded] = useState(false);
  return (
    <button className="add-button" disabled={disabled} onClick={() => { add(productId, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1600); }}>
      {added ? <Check size={18} /> : <Plus size={18} />} {added ? (label === "加入清单" ? "已加入" : "Added") : label}
    </button>
  );
}
