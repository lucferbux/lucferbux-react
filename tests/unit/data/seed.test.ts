import { describe, it, expect } from "vitest";
import { SCHEMAS } from "@/data/schema";
import { LOCALES } from "@/i18n/locales";

/**
 * Validates the versioned seed corpus against the same CollectionSchema the
 * admin editor is built from, so a malformed record fails here rather than
 * halfway through a write to production Firestore.
 *
 * `npm run seed` cannot do this check itself without credentials; this can.
 */
const seedFiles = import.meta.glob("../../../content/seed/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Record<string, unknown>[]>;

function seedFor(collection: string): Record<string, unknown>[] | null {
  const entry = Object.entries(seedFiles).find(([path]) =>
    path.endsWith(`/${collection}.json`)
  );
  return entry ? entry[1] : null;
}

describe("seed corpus", () => {
  it("has a file for every collection the admin manages", () => {
    for (const schema of Object.values(SCHEMAS)) {
      expect(
        seedFor(schema.path),
        `missing ${schema.path}.json`
      ).not.toBeNull();
    }
  });

  describe.each(Object.values(SCHEMAS))("$path", (schema) => {
    const rows = seedFor(schema.path) ?? [];

    it("is a non-empty array", () => {
      expect(Array.isArray(rows)).toBe(true);
      expect(rows.length).toBeGreaterThan(0);
    });

    it("gives every record a unique, stable _id", () => {
      // Seeding is idempotent only because each record has an explicit id.
      const ids = rows.map((r) => r._id);
      expect(ids.every((id) => typeof id === "string" && id !== "")).toBe(true);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("provides every required field", () => {
      for (const field of schema.fields) {
        if (!field.required || field.hidden) continue;

        for (const row of rows) {
          const value = row[field.name];

          if (field.i18n) {
            expect(
              typeof value === "object" && value !== null,
              `${row._id}.${field.name} should be a locale map`
            ).toBe(true);
            for (const locale of LOCALES) {
              const text = (value as Record<string, string>)[locale];
              expect(
                typeof text === "string" && text.trim() !== "",
                `${row._id}.${field.name}.${locale} is empty`
              ).toBe(true);
            }
            continue;
          }

          expect(
            value !== undefined && value !== null && value !== "",
            `${row._id}.${field.name} is missing`
          ).toBe(true);
        }
      }
    });

    it("uses the declared type for each field", () => {
      for (const row of rows) {
        for (const field of schema.fields) {
          const value = row[field.name];
          if (value === undefined) continue;

          if (field.type === "number") {
            expect(
              typeof value,
              `${row._id}.${field.name} should be a number`
            ).toBe("number");
          }
          if (field.type === "boolean") {
            expect(
              typeof value,
              `${row._id}.${field.name} should be a boolean`
            ).toBe("boolean");
          }
          if (field.type === "tags" && value !== "") {
            expect(
              Array.isArray(value),
              `${row._id}.${field.name} should be an array`
            ).toBe(true);
          }
          if (field.type === "date") {
            expect(
              typeof value === "string" && !Number.isNaN(Date.parse(value)),
              `${row._id}.${field.name} should be an ISO date string`
            ).toBe(true);
          }
        }
      }
    });

    it("passes each field's own validation", () => {
      for (const row of rows) {
        for (const field of schema.fields) {
          if (!field.validate) continue;
          const value = row[field.name];
          if (value === undefined || value === "") continue;
          expect(
            field.validate(value),
            `${row._id}.${field.name} failed validation`
          ).toBeNull();
        }
      }
    });

    it("only uses icons that exist as files", () => {
      // ResumeeCardRow resolves /images/icons/{icon}.svg, so a typo 404s.
      const icons = import.meta.glob("../../../public/images/icons/*.svg");
      const available = new Set(
        Object.keys(icons).map((p) => p.split("/").pop()!.replace(".svg", ""))
      );

      for (const row of rows) {
        if (typeof row.icon !== "string" || !row.icon) continue;
        // An icon may also be a full URL, for organisations whose only logo is
        // a raster image held in Firebase Storage. See utils/iconUrl.
        if (/^https?:\/\//.test(row.icon)) continue;
        expect(available.has(row.icon), `unknown icon "${row.icon}"`).toBe(
          true
        );
      }
    });
  });

  it("links every post to a markdown file that exists", () => {
    // A typo in internalLink used to send the reader silently to the home page.
    const posts = import.meta.glob("../../../src/content/*/*.md", {
      eager: true,
      query: "?raw",
      import: "default",
    }) as Record<string, string>;

    const slugs = new Set(
      Object.values(posts)
        .map((raw) => raw.match(/^slug:\s*"?\/?([^"\n]+)"?/m)?.[1]?.trim())
        .filter(Boolean)
    );

    for (const row of seedFor("patent") ?? []) {
      if (!row.internalLink) continue;
      expect(
        slugs.has(row.internalLink as string),
        `patent/${row._id} links to "${row.internalLink}", which has no markdown file`
      ).toBe(true);
    }
  });

  it("gives every post a banner that exists", () => {
    const banners = import.meta.glob("../../../public/images/banners/*.svg");
    const available = new Set(
      Object.keys(banners).map((p) => `/images/banners/${p.split("/").pop()}`)
    );

    for (const row of seedFor("patent") ?? []) {
      const image = row.image as string;
      if (!image || !image.startsWith("/images/banners/")) continue;
      expect(available.has(image), `missing banner ${image}`).toBe(true);
    }
  });
});

describe("security rules", () => {
  const rules = import.meta.glob("../../../firestore.rules", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;

  const source = Object.values(rules)[0] ?? "";

  it("has a match block for every collection the app reads", () => {
    // The catch-all denies everything, so a collection without its own block
    // is unreadable in production even though it works against fixtures.
    expect(source).not.toBe("");
    for (const schema of Object.values(SCHEMAS)) {
      expect(
        source.includes(`match /${schema.path}/{doc}`),
        `firestore.rules has no block for "${schema.path}"`
      ).toBe(true);
    }
  });

  it("still denies everything not explicitly matched", () => {
    expect(source).toContain("match /{document=**}");
  });
});
