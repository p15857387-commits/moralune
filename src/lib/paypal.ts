import { env } from "@/lib/env";

const apiRoot = env.PAYPAL_ENVIRONMENT === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

type PayPalLink = { rel?: string; href?: string };
type PayPalResponse = {
  id?: string;
  status?: string;
  links?: PayPalLink[];
  purchase_units?: Array<{ payments?: { captures?: Array<{ id?: string; status?: string; amount?: { currency_code?: string; value?: string } }> } }>;
};

async function accessToken() {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) throw new Error("PayPal credentials are not configured");
  const response = await fetch(`${apiRoot}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("PayPal authentication failed");
  const payload = await response.json() as { access_token?: string };
  if (!payload.access_token) throw new Error("PayPal did not return an access token");
  return payload.access_token;
}

async function request<T>(path: string, method: "POST" | "GET", body?: unknown, requestId?: string): Promise<T> {
  const token = await accessToken();
  const response = await fetch(`${apiRoot}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(requestId ? { "PayPal-Request-Id": requestId } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`PayPal request failed (${response.status})`);
  return payload as T;
}

export type PayPalLine = { name: string; productId: string; unitPrice: string; quantity: number };

export async function createPayPalOrder({ lines, locale, siteUrl }: { lines: PayPalLine[]; locale: "en" | "zh-CN"; siteUrl: string }) {
  const cents = lines.reduce((sum, line) => sum + Math.round(Number(line.unitPrice) * 100) * line.quantity, 0);
  if (!Number.isSafeInteger(cents) || cents < 1) throw new Error("Invalid PayPal order amount");
  const value = (cents / 100).toFixed(2);
  const url = new URL("/api/paypal/capture", siteUrl);
  url.searchParams.set("locale", locale);
  const cancelUrl = new URL(`/${locale}/selection?payment=cancelled`, siteUrl);
  const order = await request<PayPalResponse>("/v2/checkout/orders", "POST", {
    intent: "CAPTURE",
    purchase_units: [{
      reference_id: crypto.randomUUID(),
      description: "MORALUNE objects for living",
      items: lines.map((line) => ({
        name: line.name.slice(0, 127),
        sku: line.productId.slice(0, 127),
        quantity: String(line.quantity),
        category: "PHYSICAL_GOODS",
        unit_amount: { currency_code: "USD", value: line.unitPrice },
      })),
      amount: {
        currency_code: "USD",
        value,
        breakdown: { item_total: { currency_code: "USD", value } },
      },
    }],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "MORALUNE",
          user_action: "PAY_NOW",
          shipping_preference: "GET_FROM_FILE",
          return_url: url.toString(),
          cancel_url: cancelUrl.toString(),
        },
      },
    },
  }, crypto.randomUUID());
  const approvalUrl = order.links?.find((link) => link.rel === "payer-action" || link.rel === "approve")?.href;
  if (!order.id || !approvalUrl) throw new Error("PayPal did not return an approval link");
  return { orderId: order.id, approvalUrl };
}

export async function capturePayPalOrder(orderId: string) {
  const payload = await request<PayPalResponse>(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, "POST", {}, `capture-${orderId}`);
  const capture = payload.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    orderStatus: payload.status,
    captureStatus: capture?.status,
    captureId: capture?.id,
    currency: capture?.amount?.currency_code,
    amount: capture?.amount?.value,
  };
}
