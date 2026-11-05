import type { Locale, LocalizedText, Product, SelectionItem, SnapshotItem } from "@/types";

export function localize(value: LocalizedText | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale]?.trim() || value["zh-CN"] || value.en || "";
}

export function formatPrice(price: number, locale: Locale = "zh-CN") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(price);
}

export function snapshotSelection(items: SelectionItem[], products: Pick<Product, "id" | "slug" | "name" | "price" | "available">[], locale: Locale) {
  const unavailableIds: string[] = [];
  const snapshotItems: SnapshotItem[] = [];

  for (const item of items) {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product || !product.available) {
      unavailableIds.push(item.productId);
      continue;
    }
    const quantity = Math.max(1, Math.min(20, Math.floor(item.quantity)));
    snapshotItems.push({
      productId: product.id,
      slug: product.slug,
      name: localize(product.name, locale),
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  return { items: snapshotItems, total: snapshotItems.reduce((sum, item) => sum + item.lineTotal, 0), unavailableIds };
}
