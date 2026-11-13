/**
 * Markdown extensions for the blog. Small hand-written tree walks rather than
 * `unist-util-visit`, which is only a transitive dependency here.
 *
 * - `remarkCallouts` turns GitHub-style alerts (`> [!NOTE]`) into callouts.
 * - `rehypeBlocks` lifts the special fenced blocks (```mermaid, ```steps) out
 *   of Prism's way, and reads `title="…"` from a code fence's meta string.
 *
 * Authoring reference: docs/BLOG.md.
 */
import type { Root as MdastRoot, Blockquote, Paragraph, Text } from "mdast";
import type { Root as HastRoot, Element, ElementContent } from "hast";

export const CALLOUT_KINDS = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const;
export type CalloutKind = (typeof CALLOUT_KINDS)[number];

const ALERT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\n|$)/i;

type MdNode = { type: string; children?: MdNode[]; data?: unknown };

function walkMd(node: MdNode, fn: (node: MdNode) => void) {
  fn(node);
  node.children?.forEach((child) => walkMd(child, fn));
}

export function remarkCallouts() {
  return (tree: MdastRoot) => {
    walkMd(tree as MdNode, (node) => {
      if (node.type !== "blockquote") return;
      const quote = node as unknown as Blockquote;
      const first = quote.children[0] as Paragraph | undefined;
      const text = first?.type === "paragraph" ? first.children[0] : undefined;
      if (!text || text.type !== "text") return;

      const match = (text as Text).value.match(ALERT);
      if (!match) return;

      const kind = match[1].toLowerCase() as CalloutKind;
      (text as Text).value = (text as Text).value.slice(match[0].length);
      // An alert marker on its own line leaves an empty first paragraph.
      if (first && first.children.length === 1 && !(text as Text).value) {
        quote.children.shift();
      }
      quote.data = {
        ...quote.data,
        hProperties: { dataCallout: kind },
      };
    });
  };
}

type HastParent = {
  children: (ElementContent | HastRoot["children"][number])[];
};

function walkHast(node: HastParent, fn: (el: Element) => void) {
  for (const child of node.children) {
    if (child.type === "element") {
      fn(child);
      walkHast(child, fn);
    }
  }
}

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

/** `title="Foo.ts"` or `title='Foo.ts'` from a fence's meta string. */
function metaAttr(meta: string, name: string): string | undefined {
  const match = meta.match(new RegExp(`${name}=(?:"([^"]*)"|'([^']*)')`));
  return match ? (match[1] ?? match[2]) : undefined;
}

const BLOCKS = new Set(["mermaid", "steps"]);

export function rehypeBlocks() {
  return (tree: HastRoot) => {
    walkHast(tree as unknown as HastParent, (pre) => {
      if (pre.tagName !== "pre") return;
      const code = pre.children.find(
        (c): c is Element => c.type === "element" && c.tagName === "code"
      );
      if (!code) return;

      const classes = (code.properties.className as string[] | undefined) ?? [];
      const language = classes
        .find((c) => c.startsWith("language-"))
        ?.slice("language-".length);
      const meta =
        ((code.data as { meta?: string } | undefined)?.meta ?? "") || "";

      const title = metaAttr(meta, "title");
      if (title) pre.properties.dataTitle = title;
      if (language) pre.properties.dataLanguage = language;

      if (language && BLOCKS.has(language)) {
        // Hand the raw source to the React component and leave Prism nothing
        // to highlight: it would otherwise wrap every line in spans.
        pre.properties.dataBlock = language;
        pre.properties.dataSource = textOf(code).replace(/\n$/, "");
        pre.properties.dataMeta = meta;
        pre.children = [];
      }
    });
  };
}
