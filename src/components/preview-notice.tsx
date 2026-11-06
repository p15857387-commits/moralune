import type { Locale } from "@/types";

export function PreviewNotice({ locale }: { locale: Locale }) {
  const zh = locale === "zh-CN";
  return (
    <p className="preview-notice" role="note">
      {zh
        ? "内部预览。图片为供应商占位图，使用许可尚未确认。草稿单品暂不出售。"
        : "Internal preview. Photos are supplier placeholders — license pending. Draft pieces are not for sale."}
    </p>
  );
}
