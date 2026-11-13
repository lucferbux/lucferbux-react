/**
 * Every article in `src/content/` must parse: frontmatter, ```mermaid diagrams
 * and ```steps blocks. A broken diagram otherwise only shows up as a fallback
 * box on the live page. Authoring reference: docs/BLOG.md.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import mermaid from "mermaid";
import { parseFrontmatter } from "../../../src/utils/parseFrontmatter";

const CONTENT = resolve(__dirname, "../../../src/content");

const files = readdirSync(CONTENT).flatMap((locale) =>
  readdirSync(join(CONTENT, locale))
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ locale, file: f, path: join(CONTENT, locale, f) }))
);

function blocks(markdown: string, language: string): string[] {
  const fence = new RegExp(
    "^```" + language + "(?:[ \\t][^\\n]*)?\\n([\\s\\S]*?)^```",
    "gm"
  );
  return Array.from(markdown.matchAll(fence), (m) => m[1]);
}

mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });

describe.each(files)("$locale/$file", ({ path }) => {
  const raw = readFileSync(path, "utf8");
  const { data, content } = parseFrontmatter<Record<string, unknown>>(raw);

  it("has the required frontmatter", () => {
    expect(data.slug).toMatch(/^\/[a-z0-9-]+$/);
    expect(data.title).toBeTruthy();
    expect(String(data.date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  const diagrams = blocks(content, "mermaid");
  if (diagrams.length) {
    it.each(diagrams.map((d, i) => [i + 1, d]))(
      "mermaid diagram %i parses",
      async (_i, source) => {
        await expect(mermaid.parse(source as string)).resolves.toBeTruthy();
      }
    );
  }

  const steps = blocks(content, "steps");
  if (steps.length) {
    it("steps blocks have at least two steps", () => {
      for (const block of steps) {
        const lines = block.split("\n").filter((l) => l.trim());
        expect(lines.length).toBeGreaterThanOrEqual(2);
      }
    });
  }
});
