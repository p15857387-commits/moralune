"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SelectionItem } from "@/types";

export const MAX_QUANTITY = 20;

type SelectionState = {
  items: SelectionItem[];
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const clamp = (quantity: number) => Math.max(1, Math.min(MAX_QUANTITY, Math.floor(quantity)));

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      items: [],
      add: (productId, quantity = 1) => set((state) => {
        const existing = state.items.find((item) => item.productId === productId);
        return existing
          ? { items: state.items.map((item) => item.productId === productId ? { ...item, quantity: clamp(item.quantity + quantity) } : item) }
          : { items: [...state.items, { productId, quantity: clamp(quantity) }] };
      }),
      setQuantity: (productId, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter((item) => item.productId !== productId)
          : state.items.map((item) => item.productId === productId ? { ...item, quantity: clamp(quantity) } : item),
      })),
      remove: (productId) => set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "muyu-selection", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
