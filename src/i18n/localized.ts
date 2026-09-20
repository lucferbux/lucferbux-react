import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";

/**
 * A Firestore text value that may exist in several languages.
 *
 * Two shapes are in play:
 *  - the target shape, `{ en: "...", es: "..." }`;
 *  - the legacy shape, where the bare field holds Spanish and a `_en`-suffixed
 *    sibling holds English (`title` / `title_en`).
 *
 * `localizedField` reads both, which is what lets the components migrate
 * independently of the data. Until the collections are reseeded the site keeps
 * working against exactly what is in Firestore today.
 */
export type LocalizedValue = string | Partial<Record<Locale, string>>;

function isLocaleMap(value: unknown): value is Partial<Record<Locale, string>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value);
  return (
    keys.length > 0 &&
    keys.every((k) => (LOCALES as readonly string[]).includes(k))
  );
}

function firstNonEmpty(
  map: Partial<Record<Locale, string>>
): string | undefined {
  for (const locale of LOCALES) {
    const value = map[locale];
    if (value) return value;
  }
  return undefined;
}

/**
 * Read `field` from `doc` in `locale`.
 *
 * Resolution order:
 *  1. nested locale map -> requested locale, then the fallback, then any value;
 *  2. legacy English sibling (`<field>_en`) when the requested locale is `en`;
 *  3. legacy bare field, which historically holds Spanish;
 *  4. the bare field if it is simply a string;
 *  5. an empty string.
 */
export function localizedField(
  doc: object | null | undefined,
  field: string,
  locale: Locale,
  fallback: Locale = DEFAULT_LOCALE
): string {
  if (!doc) return "";

  // Callers pass typed models (News, Post, Work, ...) which have no index
  // signature, and documents may carry either the nested or the legacy shape.
  const record = doc as Record<string, unknown>;
  const value = record[field];

  if (isLocaleMap(value)) {
    return value[locale] ?? value[fallback] ?? firstNonEmpty(value) ?? "";
  }

  const legacyEnglish = record[`${field}_en`];

  if (locale === "en" && typeof legacyEnglish === "string" && legacyEnglish) {
    return legacyEnglish;
  }

  if (typeof value === "string" && value) return value;

  // Requested locale has no value; fall back to whatever the document has.
  if (typeof legacyEnglish === "string" && legacyEnglish) return legacyEnglish;

  return "";
}

/** Convenience for building a nested value when writing documents. */
export function toLocalized(en: string, es: string): Record<Locale, string> {
  return { en, es };
}
