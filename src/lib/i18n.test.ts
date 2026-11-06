import { describe, expect, it } from "vitest";
import { defaultLocale, locales } from "./i18n";
import { languageSwitchHref } from "@/components/language-switch";

describe("default locale", () => {
  it("treats English as the entry locale and keeps Chinese available", () => {
    expect(defaultLocale).toBe("en");
    expect(locales[0]).toBe(defaultLocale);
    expect(locales).toEqual(["en", "zh-CN"]);
  });

  it("toggles between English and Chinese without dropping the rest of the path", () => {
    expect(languageSwitchHref("/en", "en")).toBe("/zh-CN");
    expect(languageSwitchHref("/zh-CN", "zh-CN")).toBe("/en");
    expect(languageSwitchHref("/en/products/walnut-landing-tray", "en")).toBe("/zh-CN/products/walnut-landing-tray");
    expect(languageSwitchHref("/zh-CN/shop", "zh-CN")).toBe("/en/shop");
  });
});
