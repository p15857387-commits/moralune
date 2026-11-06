import { describe, expect, it } from "vitest";
import { brand, marks, wordmarks } from "./brand";

describe("brand identity", () => {
  it("uses the approved Chinese and English store names", () => {
    expect(brand.zh).toBe("MORALUNE");
    expect(brand.en).toBe("OBJECTS FOR LIVING");
    expect(brand.shortEn).toBe("MORALUNE");
  });

  it("picks the v2 wordmark and moon mark for each ground", () => {
    expect(wordmarks.light).toBe("/moralune-wordmark-blue-transparent.png");
    expect(wordmarks.onMoonMist).toBe("/moralune-wordmark-blue-on-moon-mist.png");
    expect(wordmarks.dark).toBe("/moralune-wordmark-white-on-deep-night.png");
    expect(marks.moon).toBe("/moralune-mark-moon-blue-transparent.png");
    expect(wordmarks.light).not.toBe(wordmarks.onMoonMist);
  });
});
