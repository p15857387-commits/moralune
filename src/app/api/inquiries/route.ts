import { NextResponse } from "next/server";
import { Resend } from "resend";
import { products as fallbackProducts } from "@/data/catalog";
import { snapshotSelection } from "@/lib/catalog";
import { env, hasEmail, hasSanity } from "@/lib/env";
import { escapeEmailHtml, inquirySchema, makeReference } from "@/lib/inquiry";
import { sanityClient } from "@/lib/sanity";
import type { Product } from "@/types";

export async function POST(request: Request) {
  const parsed = inquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid inquiry details", issues: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;

  let trustedProducts: Product[] = fallbackProducts;
  if (hasSanity && sanityClient) {
    trustedProducts = await sanityClient.fetch(`*[_type == "product" && _id in $ids]{"id": _id, "slug": slug.current, name, price, available}`,
      { ids: input.items.map((item) => item.productId) });
  }
  const snapshot = snapshotSelection(input.items, trustedProducts, input.locale);
  if (snapshot.unavailableIds.length) return NextResponse.json({ error: "One or more selected products are unavailable", unavailableIds: snapshot.unavailableIds }, { status: 409 });

  const reference = makeReference();
  let recordId: string | undefined;
  if (hasSanity && sanityClient) {
    const record = await sanityClient.create({ _type: "inquiry", reference, ...input, items: snapshot.items, total: snapshot.total, submittedAt: new Date().toISOString(), emailStatus: hasEmail ? "pending" : "notConfigured" });
    recordId = record._id;
  }

  let emailStatus: "sent" | "failed" | "notConfigured" = "notConfigured";
  if (hasEmail) {
    const resend = new Resend(env.RESEND_API_KEY);
    const lines = snapshot.items.map((item) => `${escapeEmailHtml(item.name)} × ${item.quantity} — ¥${item.lineTotal}`).join("<br />");
    const customerName = escapeEmailHtml(input.name);
    const customerEmail = escapeEmailHtml(input.email);
    const customerRegion = escapeEmailHtml(input.region);
    const customerNotes = escapeEmailHtml(input.notes || "无备注");
    try {
      await Promise.all([
        resend.emails.send({ from: env.FROM_EMAIL!, to: env.INQUIRY_EMAIL!, subject: `[MORALUNE 选物] ${reference} · ${input.name}`, html: `<h2>新选物意向 ${reference}</h2><p>${customerName} · ${customerEmail} · ${customerRegion}</p><p>${lines}</p><p><strong>参考合计：¥${snapshot.total}</strong></p><p>${customerNotes}</p>` }),
        resend.emails.send({ from: env.FROM_EMAIL!, to: input.email, subject: input.locale === "zh-CN" ? `MORALUNE 已收到你的选物 · ${reference}` : `MORALUNE received your selection · ${reference}`, html: `<h2>${input.locale === "zh-CN" ? "谢谢你的选择" : "Thank you for your selection"}</h2><p>${lines}</p><p>${input.locale === "zh-CN" ? "我们会确认库存、配送与后续购买方式，并尽快回复。" : "We will confirm availability, delivery and next steps shortly."}</p>` }),
      ]);
      emailStatus = "sent";
    } catch { emailStatus = "failed"; }
  }
  if (recordId && sanityClient) await sanityClient.patch(recordId).set({ emailStatus, emailUpdatedAt: new Date().toISOString() }).commit();
  return NextResponse.json({ reference, emailStatus, mode: hasSanity ? "live" : "demo" }, { status: 201 });
}
