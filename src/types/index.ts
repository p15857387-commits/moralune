export type Locale = "zh-CN" | "en";
export type LocalizedText = Record<Locale, string>;

export type Category = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
};

export type Product = {
  id: string;
  slug: string;
  name: LocalizedText;
  description?: LocalizedText;
  story?: LocalizedText;
  material?: LocalizedText;
  dimensions?: LocalizedText;
  care?: LocalizedText;
  price: number;
  category?: string;
  available: boolean;
  featured?: boolean;
  shopifyVariantId?: string;
  shoppaasBuyUrl?: string;
  image?: string;
  imageTone?: string;
};

export type SelectionItem = { productId: string; quantity: number };
export type SnapshotItem = SelectionItem & {
  slug: string;
  name: string;
  unitPrice: number;
  lineTotal: number;
};
