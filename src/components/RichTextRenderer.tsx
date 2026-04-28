import { RichText } from "@payloadcms/richtext-lexical/react";
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";
import { slugify } from "@/lib/slugify";

type AnyNode = SerializedLexicalNode & {
  tag?: string;
  text?: string;
  children?: AnyNode[];
};

const extractText = (node: AnyNode): string => {
  let out = node.text ?? "";
  if (node.children)
    for (const c of node.children) out += extractText(c as AnyNode);
  return out;
};

/**
 * Wraps Payload's <RichText> with anchor-link headings (h2/h3 get auto id + linkable #).
 * Uses the `converters` API to override heading rendering.
 */
export function RichTextRenderer({ data }: { data: SerializedEditorState }) {
  return (
    <RichText
      data={data}
      converters={({ defaultConverters }) => ({
        ...defaultConverters,
        heading: ({ node, nodesToJSX }) => {
          const tag = (node as AnyNode).tag || "h2";
          const text = extractText(node as AnyNode);
          const id = slugify(text);
          const children = nodesToJSX({
            nodes: ((node as AnyNode).children ?? []) as never,
          });
          if (tag === "h2" || tag === "h3") {
            const Tag = tag as "h2" | "h3";
            return (
              <Tag id={id} className="group relative scroll-mt-20">
                <a
                  href={`#${id}`}
                  aria-hidden
                  className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100"
                >
                  #
                </a>
                {children}
              </Tag>
            );
          }
          const FallbackTag = tag as "h1" | "h4" | "h5" | "h6";
          return <FallbackTag>{children}</FallbackTag>;
        },
      })}
    />
  );
}
