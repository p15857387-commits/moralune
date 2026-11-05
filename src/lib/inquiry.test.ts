import { describe, expect, it } from "vitest";
import { escapeEmailHtml, inquirySchema, makeReference } from "./inquiry";

describe("inquiry", () => {
  it("accepts a valid bilingual inquiry payload", () => {
    expect(inquirySchema.safeParse({
      name: "Lin", email: "lin@example.com", region: "Shanghai", notes: "", locale: "zh-CN",
      items: [{ productId: "p1", quantity: 2 }],
    }).success).toBe(true);
  });

  it("rejects invalid email and excessive quantities", () => {
    expect(inquirySchema.safeParse({
      name: "Lin", email: "wrong", region: "Shanghai", locale: "en",
      items: [{ productId: "p1", quantity: 100 }],
    }).success).toBe(false);
  });

  it("creates a readable reference", () => {
    expect(makeReference(new Date("2026-06-21T12:00:00Z"), "abcd1234")).toBe("MY-20260621-ABCD12");
  });

  it("escapes customer text before it is used in email HTML", () => {
    expect(escapeEmailHtml(`<img alt="x" src='x'>&`)).toBe("&lt;img alt=&quot;x&quot; src=&#39;x&#39;&gt;&amp;");
  });
});
