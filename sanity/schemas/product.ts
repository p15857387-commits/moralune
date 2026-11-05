import { defineType } from "sanity";
export const product = defineType({ name: "product", title: "商品", type: "document", fields: [
  { name: "name", title: "名称", type: "localizedText", validation: (rule) => rule.required() }, { name: "slug", title: "Slug", type: "slug", options: { source: "name.en" }, validation: (rule) => rule.required() },
  { name: "description", title: "简述", type: "localizedText" }, { name: "story", title: "故事", type: "localizedText" },
  { name: "material", title: "材质", type: "localizedText" }, { name: "dimensions", title: "尺寸", type: "localizedText" }, { name: "care", title: "养护", type: "localizedText" },
  { name: "price", title: "人民币价格", type: "number", validation: (rule) => rule.required().positive() }, { name: "category", title: "分类", type: "reference", to: [{ type: "category" }] },
  { name: "shopifyVariantId", title: "Shopify Variant ID", type: "string", description: "例如 gid://shopify/ProductVariant/1234567890；用于跳转 Shopify Checkout。" },
  { name: "shoppaasBuyUrl", title: "SHOPPAAS 购买链接", type: "url", description: "在 SHOPPAAS 后台生成的商品购买按钮或托管购买页链接。" },
  { name: "images", title: "图片", type: "array", of: [{ type: "image", options: { hotspot: true } }], validation: (rule) => rule.min(1) },
  { name: "available", title: "可选", type: "boolean", initialValue: true }, { name: "featured", title: "首页精选", type: "boolean", initialValue: false },
] });
