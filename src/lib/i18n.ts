import type { Locale } from "@/types";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = [defaultLocale, "zh-CN"];
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

const dictionary = {
  "zh-CN": {
    shop: "选物", about: "关于", selection: "选物清单", heroEyebrow: "为日常留一点余地",
    heroTitle: "让家，慢慢长成\n喜欢的样子。", heroBody: "我们寻找经得起触摸与时间的小物，让收纳、用餐和独处都更从容。",
    browse: "开始选物", story: "认识 MORALUNE", categories: "按生活场景浏览", featured: "本期选物", allProducts: "浏览全部",
    philosophyTitle: "少一点堆砌，\n多一点心意。", philosophyBody: "MORALUNE 相信，家的感觉常常来自一件小小的物件。我们在不同创作者与品牌之间，寻找设计、材质与日常使用恰到好处的平衡。",
    add: "加入清单", unavailable: "暂时缺货", material: "材质", dimensions: "尺寸", care: "养护", priceNote: "价格为人民币参考价，提交后将确认库存与配送。",
    footerNote: "为日常，选一点刚刚好的美。", newsletter: "偶尔来信，分享新物与日常灵感。", emailPlaceholder: "你的邮箱", subscribe: "订阅",
  },
  en: {
    shop: "Shop", about: "About", selection: "Selection", heroEyebrow: "ROOM FOR EVERYDAY LIFE",
    heroTitle: "Let home become\na place you love.", heroBody: "Considered objects with honest materials, chosen to make storing, dining and unwinding feel quietly better.",
    browse: "Browse the collection", story: "Meet MORALUNE", categories: "Shop by ritual", featured: "The current edit", allProducts: "View all",
    philosophyTitle: "Less clutter.\nMore meaning.", philosophyBody: "We believe the feeling of home often begins with one small thing. Across makers and design brands, we look for a balance of thoughtful form, material and everyday use.",
    add: "Add to selection", unavailable: "Currently unavailable", material: "Material", dimensions: "Dimensions", care: "Care", priceNote: "Prices are shown in CNY. Availability and delivery are confirmed after inquiry.",
    footerNote: "A little beauty, chosen for everyday living.", newsletter: "Occasional notes on new finds and everyday inspiration.", emailPlaceholder: "Your email", subscribe: "Subscribe",
  },
} as const;

export const t = (locale: Locale) => dictionary[locale];
