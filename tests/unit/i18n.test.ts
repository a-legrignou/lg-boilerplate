import { describe, it, expect } from "vitest";
import { LOCALES, DEFAULT_LOCALE, isLocale, localizedPath } from "@/lib/i18n";

describe("i18n", () => {
  it("exposes fr and en locales with fr as default", () => {
    expect(LOCALES).toEqual(["fr", "en"]);
    expect(DEFAULT_LOCALE).toBe("fr");
  });

  it("isLocale narrows valid strings", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale("")).toBe(false);
  });

  describe("localizedPath", () => {
    it("returns root for fr root", () => {
      expect(localizedPath("/", "fr")).toBe("/");
      expect(localizedPath("", "fr")).toBe("/");
    });

    it("keeps fr paths unprefixed", () => {
      expect(localizedPath("/about", "fr")).toBe("/about");
      expect(localizedPath("about", "fr")).toBe("/about");
      expect(localizedPath("/blog/hello", "fr")).toBe("/blog/hello");
    });

    it("prefixes non-default locales", () => {
      expect(localizedPath("/", "en")).toBe("/en");
      expect(localizedPath("/about", "en")).toBe("/en/about");
      expect(localizedPath("/blog/hello", "en")).toBe("/en/blog/hello");
    });
  });
});
