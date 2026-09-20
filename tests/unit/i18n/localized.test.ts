import { describe, it, expect } from "vitest";
import { localizedField } from "@/i18n/localized";

/**
 * The resolver is what lets the components migrate to per-locale fields
 * independently of the data. Both shapes must keep working, because live
 * Firestore still holds the legacy one.
 */
describe("localizedField", () => {
  describe("legacy shape (bare field is Spanish, _en is English)", () => {
    const doc = {
      title: "Hola mundo",
      title_en: "Hello world",
    };

    it("returns the _en sibling for English", () => {
      expect(localizedField(doc, "title", "en")).toBe("Hello world");
    });

    it("returns the bare field for Spanish", () => {
      expect(localizedField(doc, "title", "es")).toBe("Hola mundo");
    });

    it("falls back to the bare field when _en is missing", () => {
      expect(localizedField({ title: "Sólo español" }, "title", "en")).toBe(
        "Sólo español"
      );
    });

    it("falls back to _en when the bare field is empty", () => {
      expect(
        localizedField({ title: "", title_en: "Only English" }, "title", "es")
      ).toBe("Only English");
    });
  });

  describe("nested shape", () => {
    const doc = { title: { en: "Hello world", es: "Hola mundo" } };

    it("returns the requested locale", () => {
      expect(localizedField(doc, "title", "en")).toBe("Hello world");
      expect(localizedField(doc, "title", "es")).toBe("Hola mundo");
    });

    it("falls back to the default locale when the requested one is absent", () => {
      expect(
        localizedField({ title: { en: "Only English" } }, "title", "es")
      ).toBe("Only English");
    });

    it("falls back to any available translation", () => {
      expect(
        localizedField({ title: { es: "Sólo español" } }, "title", "en", "en")
      ).toBe("Sólo español");
    });
  });

  describe("edge cases", () => {
    it("returns an empty string for a missing document", () => {
      expect(localizedField(null, "title", "en")).toBe("");
      expect(localizedField(undefined, "title", "en")).toBe("");
    });

    it("returns an empty string for a missing field", () => {
      expect(localizedField({}, "title", "en")).toBe("");
    });

    it("ignores non-string, non-map values", () => {
      expect(localizedField({ title: 42 }, "title", "en")).toBe("");
      expect(localizedField({ title: ["a"] }, "title", "en")).toBe("");
    });

    it("treats an object with unknown keys as a plain value, not a locale map", () => {
      // Guards against a map like { url, alt } being mistaken for translations.
      expect(localizedField({ title: { url: "x" } }, "title", "en")).toBe("");
    });
  });
});
