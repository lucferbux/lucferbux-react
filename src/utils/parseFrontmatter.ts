/**
 * Small YAML-subset frontmatter parser.
 *
 * Deliberately not `gray-matter` or `js-yaml`: this runs in the browser via
 * `import.meta.glob`, and a full YAML parser would ship in the client bundle.
 *
 * Supported: `key: value`, quoted values, inline arrays (`tags: [a, b]`) and
 * dash lists. Anything else is read as a string.
 */

export type FrontmatterValue = string | string[];

interface ParsedFrontmatter<T = Record<string, FrontmatterValue>> {
  data: T;
  content: string;
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

/** `[a, "b c", d]` -> ["a", "b c", "d"] */
function parseInlineArray(value: string): string[] {
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
}

export function parseFrontmatter<T = Record<string, FrontmatterValue>>(
  raw: string
): ParsedFrontmatter<T> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {} as T, content: raw };
  }

  const [, yamlBlock, content] = match;
  const data: Record<string, FrontmatterValue> = {};
  let listKey: string | null = null;

  for (const line of yamlBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Continuation of a dash list started by the previous key.
    if (trimmed.startsWith("- ") && listKey) {
      (data[listKey] as string[]).push(stripQuotes(trimmed.slice(2).trim()));
      continue;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();

    if (value === "") {
      // `key:` on its own opens a dash list.
      listKey = key;
      data[key] = [];
      continue;
    }

    listKey = null;

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = parseInlineArray(value);
      continue;
    }

    data[key] = stripQuotes(value);
  }

  return { data: data as T, content };
}
