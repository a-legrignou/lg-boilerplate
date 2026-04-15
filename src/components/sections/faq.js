/**
 * FaqSection — Server Component
 *
 * Génère le JSON-LD FAQPage ici, quelle que soit la page qui héberge la section.
 * L'accordéon interactif est délégué à FaqAccordion (client component).
 */

import Script from "next/script";
import TitleSection from "@/components/widgets/title-section";
import FaqAccordion from "./faq-accordion";

export default function FaqSection({ section }) {
  const blocks = section?.blocks ?? [];

  const faqs = blocks
    .map((b) => ({ question: b?.item?.title, answer: b?.item?.content }))
    .filter((f) => f.question && f.answer);

  const jsonLd = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  } : null;

  return (
    <section className="relative px-6 py-20 max-w-4xl mx-auto w-full">
      {jsonLd && (
        <Script
          id={`faq-jsonld-${section?.id ?? "section"}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <TitleSection
        title={section?.title}
        subtitle={section?.subtitle}
        description={section?.description}
        className="text-center mb-16"
        center={true}
      />

      <FaqAccordion blocks={blocks} />
    </section>
  );
}
