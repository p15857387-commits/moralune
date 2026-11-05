import { NextResponse } from "next/server";
import { z } from "zod";
import { env, payPalCheckoutEnabled, paypalPriceMap } from "@/lib/env";
import { getCatalog } from "@/lib/catalog-source";
import { createPayPalOrder } from "@/lib/paypal";

const checkoutSchema = z.object({
  locale: z.enum(["en", "zh-CN"]),
  items: z.array(z.object({
    productId: z.string().min(1).max(160),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(30),
});

export async function POST(request: Request) {
  if (!payPalCheckoutEnabled || !env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ error: "PayPal checkout is not enabled. Configure merchant credentials, confirmed USD prices, and checkout rules first." }, { status: 503 });
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout details" }, { status: 400 });

  const catalog = await getCatalog();
  const selected = parsed.data.items.map((item) => ({ item, product: catalog.products.find((product) => product.id === item.productId) }));
  const unavailable = selected.filter(({ product }) => !product || !product.available);
  if (unavailable.length) return NextResponse.json({ error: "One or more selected products are unavailable" }, { status: 409 });

  const missingUsdPrice = selected.filter(({ item }) => !paypalPriceMap[item.productId]);
  if (missingUsdPrice.length) return NextResponse.json({ error: "A confirmed USD price is missing for one or more selected products" }, { status: 422 });

  const lines = selected.map(({ item, product }) => ({
    productId: item.productId,
    name: product!.name[parsed.data.locale] || product!.name.en,
    unitPrice: paypalPriceMap[item.productId],
    quantity: item.quantity,
  }));

  try {
    const origin = env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const result = await createPayPalOrder({ lines, locale: parsed.data.locale, siteUrl: origin });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "PayPal could not start checkout. Please try again." }, { status: 502 });
  }
}
