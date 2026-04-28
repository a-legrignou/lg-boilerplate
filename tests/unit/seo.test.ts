import { describe, it, expect } from "vitest";
import { buildMetadata } from "@/lib/seo";

describe("buildMetadata", () => {
  it("uses doc.title when meta.title is missing", () => {
    const m = buildMetadata({
      doc: { title: "About" },
      path: "/about",
      locale: "fr",
    });
    expect(m.title).toBe("About");
  });

  it("prefers meta.title over doc.title", () => {
    const m = buildMetadata({
      doc: { title: "About", meta: { title: "About — SEO" } },
      path: "/about",
      locale: "fr",
    });
    expect(m.title).toBe("About — SEO");
  });

  it("emits hreflang for fr + en + x-default", () => {
    const m = buildMetadata({
      doc: { title: "About" },
      path: "/about",
      locale: "fr",
    });
    const langs = m.alternates?.languages as Record<string, string>;
    expect(langs.fr).toMatch(/\/about$/);
    expect(langs.en).toMatch(/\/en\/about$/);
    expect(langs["x-default"]).toMatch(/\/about$/);
  });

  it("strips locale prefix from EN path before emitting hreflang", () => {
    const m = buildMetadata({
      doc: { title: "About" },
      path: "/en/about",
      locale: "en",
    });
    const langs = m.alternates?.languages as Record<string, string>;
    expect(langs.fr).toMatch(/\/about$/);
    expect(langs.en).toMatch(/\/en\/about$/);
  });

  it("falls back to dynamic OG image when no media set", () => {
    const m = buildMetadata({
      doc: { title: "Hello" },
      path: "/",
      locale: "fr",
    });
    const images = m.openGraph?.images;
    const first = Array.isArray(images) ? images[0] : images;
    expect(first).toMatchObject({
      url: expect.stringContaining("/api/og?title=Hello"),
    });
  });
});
