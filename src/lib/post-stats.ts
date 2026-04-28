import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";

const WPM = 200;

type AnyNode = SerializedLexicalNode & {
  text?: string;
  children?: AnyNode[];
};

function extractText(node: AnyNode): string {
  let out = node.text ?? "";
  if (node.children)
    for (const c of node.children) out += " " + extractText(c as AnyNode);
  return out;
}

export function postStats(
  content: SerializedEditorState | null | undefined,
  extras: string[] = [],
): { wordCount: number; readingTimeMin: number } {
  const root = content?.root as AnyNode | undefined;
  const main = root ? extractText(root) : "";
  const all = [main, ...extras].join(" ").trim();
  const words = all ? all.split(/\s+/).filter(Boolean).length : 0;
  return {
    wordCount: words,
    readingTimeMin: Math.max(1, Math.ceil(words / WPM)),
  };
}
