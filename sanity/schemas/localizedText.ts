import { defineType } from "sanity";
export const localizedText = defineType({ name: "localizedText", title: "双语文本", type: "object", fields: [{ name: "zh-CN", title: "中文", type: "string", validation: (rule) => rule.required() }, { name: "en", title: "English", type: "string", validation: (rule) => rule.required() }] });
