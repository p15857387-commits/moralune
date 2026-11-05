import { defineType } from "sanity";
export const inquiry = defineType({ name: "inquiry", title: "选品意向", type: "document", readOnly: true, fields: [
  { name: "reference", title: "意向编号", type: "string" }, { name: "name", title: "姓名", type: "string" }, { name: "email", title: "邮箱", type: "string" }, { name: "region", title: "地区", type: "string" }, { name: "notes", title: "备注", type: "text" }, { name: "locale", title: "语言", type: "string" },
  { name: "items", title: "商品快照", type: "array", of: [{ type: "object", fields: [{ name: "productId", type: "string" }, { name: "slug", type: "string" }, { name: "name", type: "string" }, { name: "unitPrice", type: "number" }, { name: "quantity", type: "number" }, { name: "lineTotal", type: "number" }] }] },
  { name: "total", title: "参考合计", type: "number" }, { name: "submittedAt", title: "提交时间", type: "datetime" }, { name: "emailStatus", title: "邮件状态", type: "string", options: { list: ["pending", "sent", "failed", "notConfigured"] } }, { name: "emailUpdatedAt", title: "邮件更新时间", type: "datetime" },
] });
