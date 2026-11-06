import { describe, expect, it } from "vitest";
import { coastScroll, indexAfterCoast, nearestIndex } from "./look-scroll";

describe("room look scroll", () => {
  const centers = [200, 600, 1000];

  it("picks the slide whose center is closest to the viewport focus", () => {
    expect(nearestIndex(centers, 180)).toBe(0);
    expect(nearestIndex(centers, 450)).toBe(1);
    expect(nearestIndex(centers, 900)).toBe(2);
    expect(nearestIndex([], 40)).toBe(0);
  });

  it("coasts in the flick direction and clamps at the ends", () => {
    expect(coastScroll(0, 0, 0, 1000)).toBe(0);
    expect(coastScroll(100, 1.2, 0, 2000)).toBeGreaterThan(200);
    expect(coastScroll(40, -3, 0, 2000)).toBe(0);
    expect(coastScroll(1800, 4, 0, 1600)).toBe(1600);
  });

  it("locks the centered look after the coast", () => {
    expect(indexAfterCoast(centers, 0, 400, 0, 2000)).toBe(0);
    expect(indexAfterCoast(centers, 0, 400, 2, 2000)).toBeGreaterThan(0);
    expect(indexAfterCoast([], 0, 400, 1, 100)).toBe(0);
  });
});
