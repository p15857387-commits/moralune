import { describe, expect, it } from "vitest";
import { languageSwitchHref } from "@/components/language-switch";
import { defaultLocale, isLocale, locales } from "./i18n";

describe("default locale", () => {
  it("treats English as the entry locale and keeps Chinese available", () => {
    expect(defaultLocale).toBe("en");
    expect(locales[0]).toBe(defaultLocale);
    expect(locales).toEqual(["en", "zh-CN"]);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh-CN")).toBe(true);
  });

  it("toggles between English and Chinese without dropping the rest of the path", () => {
    expect(languageSwitchHref("/en", "en")).toBe("/zh-CN");
    expect(languageSwitchHref("/zh-CN", "zh-CN")).toBe("/en");
    expect(languageSwitchHref("/en/products/walnut-landing-tray", "en")).toBe("/zh-CN/products/walnut-landing-tray");
    expect(languageSwitchHref("/zh-CN/shop", "zh-CN")).toBe("/en/shop");
  });
});
