import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { Section } from "@/components/Section";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import type { Appearance } from "@/blocks/appearance";

type Props = { content: SerializedEditorState; appearance?: Appearance | null };

export function RichTextBlock({ content, appearance }: Props) {
  if (!content) return null;
  return (
    <Section appearance={appearance ?? { maxWidth: "narrow", padding: "sm" }}>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichTextRenderer data={content} />
      </div>
    </Section>
  );
}
