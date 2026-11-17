import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { roomLooks } from "./looks";

describe("room looks", () => {
  it("keeps the editorial posters on disk", () => {
    expect(roomLooks.length).toBeGreaterThanOrEqual(3);
    for (const look of roomLooks) {
      expect(look.poster.startsWith("/images/")).toBe(true);
      expect(existsSync(path.join(process.cwd(), "public", look.poster))).toBe(true);
      if (look.videoSrc) expect(look.videoSrc.startsWith("/")).toBe(true);
    }
  });
});
