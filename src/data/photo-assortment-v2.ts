import type { Product } from "@/types";
import files from "./photo-assortment-v2.files.json";

/**
 * Current preview assortment. Filenames are camera ids, not SKUs.
 * One unpublished item per unique image. No material, price, or certification is stated.
 * To replace a photo, overwrite `public/products/v2/<category>/<file>` and keep the filename.
 * See src/data/PHOTOS.md.
 */

const labels: Record<string, { en: string; zh: string }> = {
  rugs: { en: "Rug", zh: "块毯" },
  cushions: { en: "Cushion", zh: "抱枕" },
  "wall-hangings": { en: "Wall hanging", zh: "墙面挂饰" },
  objects: { en: "Object", zh: "小摆件" },
  lamps: { en: "Lamp", zh: "灯具" },
};

type Row = { id: string; slug: string; file: string; category: string };

const note = {
  en: "Preview photograph. Material, size, and price are not confirmed.",
  "zh-CN": "预览图片。材质、尺寸与价格尚未确认。",
};

export const photoAssortmentV2: Product[] = (files as Row[]).map((row) => {
  const label = labels[row.category];
  if (!label) throw new Error(`Unknown v2 category ${row.category}`);
  const src = `/products/v2/${row.category}/${row.file}`;
  const code = row.id.replace(/^img-/, "").toUpperCase();
  return {
    id: row.id,
    slug: row.slug,
    name: { en: `${label.en} ${code}`, "zh-CN": `${label.zh} ${code}` },
    description: note,
    price: 0,
    available: false,
    category: row.category,
    featured: false,
    status: "draft",
    published: false,
    image: src,
    images: [{ src, filename: row.file, role: "hero" }],
  };
});
