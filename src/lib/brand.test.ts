import { describe, expect, it } from "vitest";
import { brand, wordmarks } from "./brand";

describe("brand identity", () => {
  it("uses the approved Chinese and English store names", () => {
    expect(brand.zh).toBe("MORALUNE");
    expect(brand.en).toBe("OBJECTS FOR LIVING");
    expect(brand.shortEn).toBe("MORALUNE");
  });

  it("picks the v2 wordmark for light and deep-night grounds", () => {
    expect(wordmarks.light).toBe("/moralune-wordmark.png");
    expect(wordmarks.dark).toBe("/moralune-wordmark-white-on-deep-night.png");
  });
});
