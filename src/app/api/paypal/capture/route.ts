import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("token") || "";
  const locale = url.searchParams.get("locale") === "zh-CN" ? "zh-CN" : "en";
  if (!/^[A-Z0-9]{10,40}$/.test(orderId)) {
    return NextResponse.redirect(new URL(`/${locale}/selection?payment=failed`, url.origin));
  }

  try {
    const result = await capturePayPalOrder(orderId);
    if (result.orderStatus !== "COMPLETED" || result.captureStatus !== "COMPLETED" || result.currency !== "USD") {
      return NextResponse.redirect(new URL(`/${locale}/selection?payment=failed`, url.origin));
    }
    const confirmed = new URL(`/${locale}/payment/confirmed`, url.origin);
    confirmed.searchParams.set("reference", orderId);
    return NextResponse.redirect(confirmed);
  } catch {
    return NextResponse.redirect(new URL(`/${locale}/selection?payment=failed`, url.origin));
  }
}
