import { defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "商品",
  type: "document",
  fields: [
    { name: "name", title: "名称", type: "localizedText", validation: (rule) => rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name.en" }, validation: (rule) => rule.required() },
    { name: "description", title: "简述", type: "localizedText" },
    { name: "story", title: "故事", type: "localizedText" },
    { name: "material", title: "材质", type: "localizedText" },
    { name: "dimensions", title: "尺寸", type: "localizedText" },
    { name: "care", title: "养护", type: "localizedText" },
    {
      name: "price",
      title: "人民币价格",
      type: "number",
      description: "确认后的人民币售价。不要填商品主数据里的 EST 零售估算、FOB 或毛利。",
      validation: (rule) => rule.required().positive(),
    },
    { name: "category", title: "分类", type: "reference", to: [{ type: "category" }] },
    { name: "shopifyVariantId", title: "Shopify Variant ID", type: "string", description: "例如 gid://shopify/ProductVariant/1234567890；用于跳转 Shopify Checkout。" },
    { name: "shoppaasBuyUrl", title: "SHOPPAAS 购买链接", type: "url", description: "在 SHOPPAAS 后台生成的商品购买按钮或托管购买页链接。" },
    { name: "images", title: "图片", type: "array", of: [{ type: "image", options: { hotspot: true } }], validation: (rule) => rule.min(1) },
    { name: "available", title: "可选", type: "boolean", initialValue: true },
    { name: "featured", title: "首页精选", type: "boolean", initialValue: false },
    {
      name: "status",
      title: "发布状态",
      type: "string",
      options: { list: [{ title: "草稿", value: "draft" }, { title: "已发布", value: "published" }] },
      initialValue: "published",
      description: "草稿不会出现在商店、商品页或站点地图。",
    },
    {
      name: "published",
      title: "已上架",
      type: "boolean",
      initialValue: true,
      description: "关闭后商店与商品页不展示。商品主数据导入保持未上架。",
    },
    {
      name: "listingRecommendation",
      title: "上架建议",
      type: "string",
      options: {
        list: [
          { title: "待评估", value: "pending-review" },
          { title: "不要上架", value: "do-not-list" },
          { title: "不进货盘", value: "off-assortment" },
        ],
      },
    },
    {
      name: "offAssortment",
      title: "不进货盘",
      type: "boolean",
      initialValue: false,
      description: "明确不建议上架的 SKU（例如 WAL-LOOM）保持开启，商店不展示。",
    },
  ],
});
