import { test, expect } from "@playwright/test";

test("payload admin reachable", async ({ page }) => {
  const response = await page.goto("/admin", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(500);
});

test("OG image generator returns a PNG", async ({ request }) => {
  const res = await request.get("/api/og?title=Hello%20World");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("rate limiting kicks in on /api/vitals", async ({ request }) => {
  let blocked = false;
  for (let i = 0; i < 80; i++) {
    const res = await request.post("/api/vitals", {
      data: { name: "LCP", value: 100 },
    });
    if (res.status() === 429) {
      blocked = true;
      break;
    }
  }
  expect(blocked).toBe(true);
});
