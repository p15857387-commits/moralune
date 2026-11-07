import type { Locale } from "@/types";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = [defaultLocale, "zh-CN"];
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

const dictionary = {
  "zh-CN": {
    shop: "商店", about: "关于", selection: "选物清单", announcement: "块毯、织物、墙面、器物与灯。",
    heroEyebrow: "为家而设计",
    heroTitle: "安静的光\n放进已有的房间。", heroBody: "块毯、抱枕与披肩、墙面挂饰、器物与灯。看材质，看比例，也看一间房间安静下来的方式。",
    browse: "进入系列", story: "关于", categories: "系列", featured: "本期", allProducts: "全部系列",
    collection: "全部系列", collectionLead: "块毯、织物、墙面挂饰、器物与灯。",
    philosophyTitle: "留得下的，\n是手碰得到的。", philosophyBody: "看得到织纹的羊毛，垂下来的亚麻，边角柔和的陶，浅色的木，尽量保持原样。放回那间房间仍然合适，才会留在这里。",
    add: "加入清单", unavailable: "暂时缺货", material: "材质", dimensions: "尺寸", care: "养护", priceNote: "价格为人民币参考价，提交后将确认库存与配送。",
    footerNote: "安静的光，放进已有的房间。", footerSign: "为家而设计。", newsletter: "偶尔来信，只谈新作与房间。", emailPlaceholder: "你的邮箱", subscribe: "订阅",
  },
  en: {
    shop: "Shop", about: "About", selection: "Selection", announcement: "Art rugs, textiles, wall, objects, and light.",
    heroEyebrow: "Design for the home",
    heroTitle: "Quiet light\nfor the rooms you keep.", heroBody: "Art rugs, cushions and throws, wall hangings, objects, and lamps. Chosen for material, proportion, and the hush of a finished room.",
    browse: "Explore the collection", story: "About", categories: "The collection", featured: "The edit", allProducts: "The full collection",
    collection: "The collection", collectionLead: "Art rugs, textiles, wall hangings, objects, and lamps.",
    philosophyTitle: "What stays\nis what you can touch.", philosophyBody: "Wool you can see. Linen that falls. Clay with a soft edge. Pale wood, left mostly as it is. A piece remains when it still belongs in the room it was chosen for.",
    add: "Add to selection", unavailable: "Currently unavailable", material: "Material", dimensions: "Dimensions", care: "Care", priceNote: "Prices are shown in CNY. Availability and delivery are confirmed after inquiry.",
    footerNote: "Quiet light for the rooms you keep.", footerSign: "Design for the home.", newsletter: "Occasional notes on new pieces and the rooms they enter.", emailPlaceholder: "Your email", subscribe: "Subscribe",
  },
} as const;

export const t = (locale: Locale) => dictionary[locale];
