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

function draft(row: { id: string; slug: string; file: string; category: string; name: { en: string; "zh-CN": string } }): Product {
  const src = `/products/v2/${row.category}/${row.file}`;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
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
}

/** Named previews Paul added after the camera-id set. One image, one category. */
export const photoAssortmentV2Leads: Product[] = [
  draft({ id: "rug-organic-01", slug: "rug-organic-01", file: "rug-organic-01.jpg", category: "rugs", name: { en: "Irregular rug", "zh-CN": "不规则块毯" } }),
  draft({ id: "cushion-sphere-01", slug: "cushion-sphere-01", file: "cushion-sphere-01.jpg", category: "cushions", name: { en: "Sphere cushion", "zh-CN": "球形抱枕" } }),
  draft({ id: "wall-clock-01", slug: "wall-clock-01", file: "wall-clock-01.jpg", category: "wall-hangings", name: { en: "Wall clock", "zh-CN": "墙面时钟" } }),
  draft({ id: "object-footed-bowl-01", slug: "object-footed-bowl-01", file: "object-footed-bowl-01.jpg", category: "objects", name: { en: "Footed bowl", "zh-CN": "高足碗" } }),
  draft({ id: "lamp-stitched-01", slug: "lamp-stitched-01", file: "lamp-stitched-01.jpg", category: "lamps", name: { en: "Stitched lamp", "zh-CN": "缝线灯" } }),
];

const cameraAssortment: Product[] = (files as Row[]).map((row) => {
  const label = labels[row.category];
  if (!label) throw new Error(`Unknown v2 category ${row.category}`);
  const code = row.id.replace(/^img-/, "").toUpperCase();
  return draft({ ...row, name: { en: `${label.en} ${code}`, "zh-CN": `${label.zh} ${code}` } });
});

/** Each named preview leads its category. The camera-id order after that is unchanged. */
export const photoAssortmentV2: Product[] = (() => {
  const pending = [...photoAssortmentV2Leads];
  const listed: Product[] = [];
  for (const product of cameraAssortment) {
    const index = pending.findIndex((lead) => lead.category === product.category);
    if (index >= 0) {
      listed.push(pending[index]);
      pending.splice(index, 1);
    }
    listed.push(product);
  }
  return [...listed, ...pending];
})();
