import { describe, it, expect } from "vitest";
import {
  faqSchema,
  productSchema,
  breadcrumbSchema,
  howToSchema,
} from "@/lib/structured-data";

describe("structured-data", () => {
  it("faqSchema produces valid FAQPage", () => {
    const s = faqSchema([
      { question: "Q1?", answer: "A1" },
      { question: "Q2?", answer: "A2" },
    ]) as { "@type": string; mainEntity: unknown[] };
    expect(s["@type"]).toBe("FAQPage");
    expect(s.mainEntity).toHaveLength(2);
  });

  it("productSchema includes offers + currency", () => {
    const s = productSchema({
      name: "Premium",
      price: 9,
      priceCurrency: "EUR",
    }) as {
      "@type": string;
      offers: { price: number; priceCurrency: string; availability: string };
    };
    expect(s["@type"]).toBe("Product");
    expect(s.offers.priceCurrency).toBe("EUR");
    expect(s.offers.availability).toContain("InStock");
  });

  it("breadcrumbSchema emits ordered ListItems", () => {
    const s = breadcrumbSchema(
      [
        { label: "Home", path: "/" },
        { label: "Blog", path: "/blog" },
      ],
      "fr",
    ) as { itemListElement: { position: number; name: string }[] };
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].name).toBe("Blog");
  });

  it("howToSchema emits steps with positions", () => {
    const s = howToSchema({
      name: "Setup",
      steps: [
        { name: "Install", text: "pnpm install" },
        { name: "Run", text: "pnpm dev" },
      ],
    }) as { step: { position: number }[] };
    expect(s.step).toHaveLength(2);
    expect(s.step[0].position).toBe(1);
  });
});
