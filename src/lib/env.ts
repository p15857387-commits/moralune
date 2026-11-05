import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));
export const env = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  SHOPPAAS_STORE_URL: optionalUrl,
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
  SANITY_API_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  INQUIRY_EMAIL: z.string().email().optional(),
  FROM_EMAIL: z.string().min(3).optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_ENVIRONMENT: z.enum(["sandbox", "live"]).default("sandbox"),
  PAYPAL_CHECKOUT_ENABLED: z.enum(["true", "false"]).default("false"),
  PAYPAL_USD_PRICES: z.string().optional(),
}).parse(process.env);

export const hasSanity = Boolean(env.NEXT_PUBLIC_SANITY_PROJECT_ID && env.SANITY_API_TOKEN);
export const hasSanityRead = Boolean(env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const hasEmail = Boolean(env.RESEND_API_KEY && env.INQUIRY_EMAIL && env.FROM_EMAIL);
export const hasPayPal = Boolean(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET);
export const hasShoppaas = Boolean(env.SHOPPAAS_STORE_URL);
export const payPalCheckoutEnabled = env.PAYPAL_CHECKOUT_ENABLED === "true";
export const paypalPriceMap: Record<string, string> = (() => {
  try {
    const parsed: unknown = JSON.parse(env.PAYPAL_USD_PRICES || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([key, value]) =>
      key.length > 0 && typeof value === "string" && /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0,
    ));
  } catch {
    return {};
  }
})();
