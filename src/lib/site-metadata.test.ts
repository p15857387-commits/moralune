import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { previewRobots, rootMetadata } from "./site-metadata";

describe("preview noindex", () => {
  it("disallows indexing in metadata and robots.txt", () => {
    expect(previewRobots).toEqual({ index: false, follow: false });
    expect(rootMetadata.robots).toEqual({ index: false, follow: false });
    const file = readFileSync("public/robots.txt", "utf8");
    expect(file).toMatch(/User-agent:\s*\*/);
    expect(file).toMatch(/Disallow:\s*\//);
    expect(file).not.toMatch(/Allow:/);
    expect(file).not.toMatch(/Sitemap:/i);
  });
});
