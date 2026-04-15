import TitleSection from "@/components/widgets/title-section";
import Step from "@/components/blocks/step";

export default function GridMethod({ section, tone = "muted" }) {
  const blocks = section?.blocks ?? [];

  const containerCls = section?.container !== false ? "max-w-6xl mx-auto w-full px-6 py-20" : "w-full px-6 py-20";

  return (
    <section className={containerCls}>
      <TitleSection title={section?.title} subtitle={section?.subtitle} description={section?.description} tone={tone} />

      <div className="mt-12">
        {blocks.map((block, i) => {
          const item = block?.item ?? block;
          return (
            <Step
              key={item?.id ?? i}
              block={item}
              number={String(i + 1).padStart(2, "0")}
              tone={tone}
            />
          );
        })}
      </div>
    </section>
  );
}
