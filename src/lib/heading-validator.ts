import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";

type AnyNode = SerializedLexicalNode & {
  tag?: string;
  type?: string;
  children?: AnyNode[];
};

/**
 * Walk a Lexical state and warn if heading hierarchy is invalid:
 * - Don't use h1 (article title is already h1)
 * - Don't skip levels (h2 → h4)
 * Returns null if OK, or a string error.
 */
export function validateHeadings(
  value: SerializedEditorState | null | undefined,
): string | null {
  if (!value?.root) return null;
  const headings: number[] = [];
  const walk = (node: AnyNode) => {
    if (node.type === "heading" && node.tag) {
      const level = parseInt(node.tag.replace("h", ""), 10);
      if (!Number.isNaN(level)) headings.push(level);
    }
    if (node.children) for (const c of node.children) walk(c as AnyNode);
  };
  walk(value.root as AnyNode);

  if (headings.includes(1)) {
    return "N'utilise pas de h1 dans le contenu — le titre du document est déjà h1. Utilise h2/h3.";
  }
  for (let i = 1; i < headings.length; i++) {
    const diff = headings[i] - headings[i - 1];
    if (diff > 1) {
      return `Hiérarchie de titres incorrecte : h${headings[i - 1]} → h${headings[i]} (saut de ${diff} niveaux). Évite de sauter des niveaux.`;
    }
  }
  return null;
}
