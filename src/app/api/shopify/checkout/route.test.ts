import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/shopify/checkout", () => {
  it("returns a retired response because MORALUNE uses direct PayPal checkout", async () => {
    const response = await POST();
    await expect(response.json()).resolves.toEqual({ error: "Shopify checkout is not used by MORALUNE. Use the direct PayPal checkout flow." });
    expect(response.status).toBe(410);
  });
});
