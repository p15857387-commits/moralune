import type { Category, Product } from "@/types";
import { photoAssortmentV2 } from "./photo-assortment-v2";

const text = (zh: string, en: string) => ({ "zh-CN": zh, en });

export const categories: Category[] = [
  { id: "rugs", slug: "rugs", name: text("块毯", "Rugs"), description: text("羊毛与织纹，铺在地面上的安静一层。", "Wool and weave for the floor.") },
  { id: "cushions", slug: "cushions", name: text("抱枕", "Cushions"), description: text("沙发与床上的柔软一层。", "Soft layers for the sofa and bed.") },
  { id: "wall-hangings", slug: "wall-hangings", name: text("墙面挂饰", "Wall Hangings"), description: text("给墙面留一件安静的作品。", "Hangings for a quiet wall.") },
  { id: "objects", slug: "objects", name: text("小摆件", "Objects"), description: text("桌面、玄关与层架上的小件。", "Small pieces for the table, entry, and shelf.") },
  { id: "lamps", slug: "lamps", name: text("灯具", "Lamps"), description: text("让房间保持柔和的灯。", "Lamps that keep a room soft.") },
];

/** Current preview assortment. Old demo and supplier-master rows are not listed. */
export const products: Product[] = photoAssortmentV2;

export function getProduct(slug: string) { return products.find((product) => product.slug === slug); }
export function getCategory(slug: string) { return categories.find((category) => category.slug === slug); }
