import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Shopify checkout is not used by MORALUNE. Use the direct PayPal checkout flow." }, { status: 410 });
}
