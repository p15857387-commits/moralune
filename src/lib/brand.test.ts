import { describe, expect, it } from "vitest";
import { brand } from "./brand";

describe("brand identity", () => {
  it("uses the approved Chinese and English store names", () => {
    expect(brand.zh).toBe("MORALUNE");
    expect(brand.en).toBe("OBJECTS FOR LIVING");
    expect(brand.shortEn).toBe("MORALUNE");
  });
});
