import { describe, it, expect } from "vitest";
import { isVisible } from "@/blocks/visibility";

describe("isVisible", () => {
  const now = new Date("2026-04-26T12:00:00Z");

  it("returns true when no visibility constraints", () => {
    expect(isVisible(null, "fr", now)).toBe(true);
    expect(isVisible({}, "fr", now)).toBe(true);
    expect(isVisible({ showIfLocale: "any" }, "fr", now)).toBe(true);
  });

  it("filters by locale", () => {
    expect(isVisible({ showIfLocale: "fr" }, "fr", now)).toBe(true);
    expect(isVisible({ showIfLocale: "fr" }, "en", now)).toBe(false);
    expect(isVisible({ showIfLocale: "en" }, "fr", now)).toBe(false);
  });

  it("respects showFrom (future = hidden)", () => {
    expect(isVisible({ showFrom: "2026-01-01" }, "fr", now)).toBe(true);
    expect(isVisible({ showFrom: "2026-12-31" }, "fr", now)).toBe(false);
  });

  it("respects showUntil (past = hidden)", () => {
    expect(isVisible({ showUntil: "2026-12-31" }, "fr", now)).toBe(true);
    expect(isVisible({ showUntil: "2026-01-01" }, "fr", now)).toBe(false);
  });

  it("combines constraints (AND logic)", () => {
    expect(
      isVisible(
        { showIfLocale: "fr", showFrom: "2026-01-01", showUntil: "2026-12-31" },
        "fr",
        now,
      ),
    ).toBe(true);
    expect(
      isVisible(
        { showIfLocale: "en", showFrom: "2026-01-01", showUntil: "2026-12-31" },
        "fr",
        now,
      ),
    ).toBe(false);
  });
});
