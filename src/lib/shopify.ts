import { z } from "zod";
import type { Product, SelectionItem } from "@/types";

export const shopifyCheckoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1).max(30),
});

export type ShopifyCheckoutInput = z.infer<typeof shopifyCheckoutSchema>;
export type ShopifyCartLine = { merchandiseId: string; quantity: number };
type Fetcher = typeof fetch;

export function buildShopifyCartLines(
  items: SelectionItem[],
  products: Pick<Product, "id" | "available" | "shopifyVariantId">[],
) {
  const lines: ShopifyCartLine[] = [];
  const unavailableIds: string[] = [];
  const unmappedIds: string[] = [];

  for (const item of items) {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product || !product.available) {
      unavailableIds.push(item.productId);
      continue;
    }
    if (!product.shopifyVariantId?.trim()) {
      unmappedIds.push(item.productId);
      continue;
    }
    lines.push({ merchandiseId: product.shopifyVariantId, quantity: Math.max(1, Math.min(20, Math.floor(item.quantity))) });
  }

  return { lines, unavailableIds, unmappedIds };
}

export async function createShopifyCart({
  storeDomain,
  accessToken,
  apiVersion,
  lines,
  fetcher = fetch,
}: {
  storeDomain: string;
  accessToken: string;
  apiVersion: string;
  lines: ShopifyCartLine[];
  fetcher?: Fetcher;
}) {
  const response = await fetcher(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query: `mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { checkoutUrl }
          userErrors { field message }
        }
      }`,
      variables: { input: { lines } },
    }),
  });

  if (!response.ok) throw new Error(`Shopify request failed with status ${response.status}`);

  const payload = await response.json();
  const userErrors = payload?.data?.cartCreate?.userErrors ?? [];
  if (userErrors.length) throw new Error(userErrors.map((error: { message: string }) => error.message).join("; "));

  const checkoutUrl = payload?.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) throw new Error("Shopify did not return a checkout URL");

  return { checkoutUrl: String(checkoutUrl) };
}
