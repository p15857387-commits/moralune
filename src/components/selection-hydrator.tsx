"use client";

import { useEffect } from "react";
import { useSelectionStore } from "@/store/selection";

export function SelectionHydrator() {
  useEffect(() => { useSelectionStore.persist.rehydrate(); }, []);
  return null;
}
