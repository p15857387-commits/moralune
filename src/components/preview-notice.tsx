import type { Locale } from "@/types";

export function PreviewNotice({ locale }: { locale: Locale }) {
  const zh = locale === "zh-CN";
  return (
    <p className="preview-notice" role="note">
      {zh
        ? "内部预览。图片许可尚未确认。这些单品暂不出售。"
        : "Internal preview. Photo license is not confirmed. These pieces are not for sale."}
    </p>
  );
}
