import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  region: z.string().trim().min(2).max(120),
  notes: z.string().trim().max(1200).optional().default(""),
  locale: z.enum(["zh-CN", "en"]),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1).max(30),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** Escapes customer-supplied text before it is interpolated into transactional email HTML. */
export function escapeEmailHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function makeReference(date = new Date(), entropy = crypto.randomUUID()) {
  const day = date.toISOString().slice(0, 10).replaceAll("-", "");
  return `MY-${day}-${entropy.replaceAll("-", "").slice(0, 6).toUpperCase()}`;
}
