import type { Locale, LocalizedText, Product, SelectionItem, SnapshotItem } from "@/types";

export function localize(value: LocalizedText | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale]?.trim() || value["zh-CN"] || value.en || "";
}

const categoryOrder = ["art-rugs", "cushions-throws", "wall-art", "artful-storage", "decorative-lighting"];

export function sortCategories<T extends { slug: string }>(categories: T[]): T[] {
  return [...categories].sort((a, b) => {
    const ai = categoryOrder.indexOf(a.slug);
    const bi = categoryOrder.indexOf(b.slug);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
}

export function displayName(value: LocalizedText | undefined, locale: Locale): string {
  const raw = localize(value, locale);
  if (locale !== "en" || !raw) return raw;
  const lower = raw.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
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
