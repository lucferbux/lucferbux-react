import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "@/utils/parseFrontmatter";

describe("parseFrontmatter", () => {
  it("splits frontmatter from content", () => {
    const { data, content } = parseFrontmatter(
      ["---", "title: Hello", "slug: /hello", "---", "Body text."].join("\n")
    );
    expect(data).toEqual({ title: "Hello", slug: "/hello" });
    expect(content).toBe("Body text.");
  });

  it("strips matched surrounding quotes", () => {
    const { data } = parseFrontmatter(
      ["---", 'a: "double"', "b: 'single'", "c: unquoted", "---", ""].join("\n")
    );
    expect(data).toEqual({ a: "double", b: "single", c: "unquoted" });
  });

  it("returns the whole input as content when there is no frontmatter", () => {
    const raw = "# Just a heading\n\nNo frontmatter here.";
    expect(parseFrontmatter(raw)).toEqual({ data: {}, content: raw });
  });

  it("handles CRLF line endings", () => {
    const { data, content } = parseFrontmatter(
      "---\r\ntitle: Windows\r\n---\r\nBody"
    );
    expect(data).toEqual({ title: "Windows" });
    expect(content).toBe("Body");
  });

  it("skips comments and blank lines", () => {
    const { data } = parseFrontmatter(
      ["---", "# a comment", "", "title: Kept", "---", ""].join("\n")
    );
    expect(data).toEqual({ title: "Kept" });
  });

  it("keeps colons that appear inside a value", () => {
    // Splitting on the FIRST colon is what makes URLs and "A: B" titles work.
    const { data } = parseFrontmatter(
      [
        "---",
        'title: "Part One: The Beginning"',
        "url: https://example.com/x",
        "---",
        "",
      ].join("\n")
    );
    expect(data.title).toBe("Part One: The Beginning");
    expect(data.url).toBe("https://example.com/x");
  });

  it("stops at the first closing delimiter, leaving later --- in the body", () => {
    const { data, content } = parseFrontmatter(
      ["---", "title: T", "---", "Intro", "", "---", "", "Outro"].join("\n")
    );
    expect(data).toEqual({ title: "T" });
    expect(content).toContain("---");
    expect(content).toContain("Outro");
  });

  it("ignores lines with no colon", () => {
    const { data } = parseFrontmatter(
      ["---", "title: T", "garbage line", "---", ""].join("\n")
    );
    expect(data).toEqual({ title: "T" });
  });

  it("parses every real post in src/content", async () => {
    const posts = import.meta.glob("../../../src/content/**/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;

    expect(Object.keys(posts).length).toBeGreaterThan(0);

    for (const [path, raw] of Object.entries(posts)) {
      const { data, content } = parseFrontmatter<Record<string, string>>(raw);
      expect(data.slug, `${path} is missing a slug`).toBeTruthy();
      expect(data.title, `${path} is missing a title`).toBeTruthy();
      expect(data.date, `${path} is missing a date`).toBeTruthy();
      expect(
        Number.isNaN(Date.parse(data.date)),
        `${path} has an unparseable date: ${data.date}`
      ).toBe(false);
      expect(content.trim().length, `${path} has no body`).toBeGreaterThan(0);
    }
  });

  describe("arrays", () => {
    it("parses an inline array", () => {
      const { data } = parseFrontmatter(
        ["---", "tags: [react, testing]", "---", ""].join("\n")
      );
      expect(data.tags).toEqual(["react", "testing"]);
    });

    it("strips quotes from inline array items", () => {
      const { data } = parseFrontmatter(
        ["---", "tags: [\"react hooks\", 'event loop']", "---", ""].join("\n")
      );
      expect(data.tags).toEqual(["react hooks", "event loop"]);
    });

    it("parses a dash list", () => {
      const { data } = parseFrontmatter(
        [
          "---",
          "tags:",
          "  - react",
          "  - testing",
          "title: T",
          "---",
          "",
        ].join("\n")
      );
      expect(data.tags).toEqual(["react", "testing"]);
      expect(data.title).toBe("T");
    });

    it("treats an empty inline array as empty", () => {
      const { data } = parseFrontmatter(
        ["---", "tags: []", "---", ""].join("\n")
      );
      expect(data.tags).toEqual([]);
    });
  });

  describe("known limitations", () => {
    it("does not coerce numbers or booleans", () => {
      const { data } = parseFrontmatter(
        ["---", "draft: true", "order: 3", "---", ""].join("\n")
      );
      expect(data.draft).toBe("true");
      expect(data.order).toBe("3");
    });

    it("does not support multi-line or folded values", () => {
      const { data } = parseFrontmatter(
        ["---", "summary: >", "  continued here", "---", ""].join("\n")
      );
      // The folding indicator is taken literally and the continuation line,
      // having no colon, is dropped entirely.
      expect(data.summary).toBe(">");
      expect(data).not.toHaveProperty("continued here");
    });
  });
});
