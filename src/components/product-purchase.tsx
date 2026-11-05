"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToSelection } from "./add-to-selection";

export function ProductPurchase({ productId, available, addLabel, unavailableLabel }: { productId: string; available: boolean; addLabel: string; unavailableLabel: string }) {
  const [quantity, setQuantity] = useState(1);
  return <div className="purchase-row"><div className="quantity-control"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity((q) => Math.min(20, q + 1))} aria-label="Increase quantity"><Plus size={15} /></button></div><AddToSelection productId={productId} quantity={quantity} label={available ? addLabel : unavailableLabel} disabled={!available} /></div>;
}
