/**
 * Lightweight frontmatter parser for simple YAML key: "value" pairs.
 * Replaces gray-matter to avoid bloating the browser bundle with Node.js polyfills.
 */

interface ParsedFrontmatter<T = Record<string, string>> {
  data: T;
  content: string;
}

export function parseFrontmatter<T = Record<string, string>>(
  raw: string
): ParsedFrontmatter<T> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {} as T, content: raw };
  }

  const [, yamlBlock, content] = match;
  const data: Record<string, string> = {};

  for (const line of yamlBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data: data as T, content };
}
