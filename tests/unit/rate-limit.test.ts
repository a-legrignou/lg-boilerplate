import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to limit", () => {
    const key = `test-allow-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      const r = rateLimit({ key, limit: 3, windowMs: 60_000 });
      expect(r.ok).toBe(true);
    }
  });

  it("blocks when limit exceeded", () => {
    const key = `test-block-${Math.random()}`;
    rateLimit({ key, limit: 2, windowMs: 60_000 });
    rateLimit({ key, limit: 2, windowMs: 60_000 });
    const r = rateLimit({ key, limit: 2, windowMs: 60_000 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.retryAfter).toBeGreaterThan(0);
  });

  it("resets after window", async () => {
    const key = `test-reset-${Math.random()}`;
    rateLimit({ key, limit: 1, windowMs: 50 });
    expect(rateLimit({ key, limit: 1, windowMs: 50 }).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 60));
    expect(rateLimit({ key, limit: 1, windowMs: 50 }).ok).toBe(true);
  });
});
