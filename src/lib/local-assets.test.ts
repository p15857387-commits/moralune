import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function jpegSize(path: string) {
  const data = readFileSync(path);
  let i = 2;
  while (i < data.length - 8) {
    if (data[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = data[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { width: data.readUInt16BE(i + 7), height: data.readUInt16BE(i + 5), bytes: data.length };
    }
    if (marker === 0xd8 || marker === 0xd9) {
      i += 2;
      continue;
    }
    i += 2 + data.readUInt16BE(i + 2);
  }
  throw new Error(`No JPEG size in ${path}`);
}

describe("self-hosted preview assets", () => {
  it("keeps fonts and the About photograph off Google Fonts and Unsplash", () => {
    const globals = readFileSync("src/app/globals.css", "utf8");
    const about = readFileSync("src/app/[locale]/about/page.tsx", "utf8");
    const fonts = readFileSync("src/app/fonts.css", "utf8");
    expect(globals).toContain('@import "./fonts.css"');
    expect(globals + about + fonts).not.toMatch(/fonts\.googleapis|fonts\.gstatic|images\.unsplash/);
    expect(about).toContain('src="/images/about/quiet-home-interior.jpg"');
    const urls = [...fonts.matchAll(/url\((\/fonts\/[^)]+\.woff2)\)/g)].map((match) => match[1]);
    expect(urls.length).toBe(620);
    for (const url of urls) {
      expect(existsSync(resolve("public", url.slice(1))), url).toBe(true);
    }
    for (const license of ["dm-sans", "newsreader", "noto-sans-sc", "noto-serif-sc"]) {
      const text = readFileSync(`public/fonts/licenses/${license}-OFL-1.1.txt`, "utf8");
      expect(text).toContain("SIL OPEN FONT LICENSE");
    }
    expect(jpegSize("public/images/about/quiet-home-interior.jpg")).toEqual({ width: 1800, height: 1013, bytes: 296323 });
  });
});
