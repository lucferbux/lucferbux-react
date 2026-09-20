export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Storage key for the visitor's explicit choice. */
export const LOCALE_STORAGE_KEY = "lucferbux.locale";

/** Locale tags passed to `Intl`, which needs a region for correct formatting. */
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

/**
 * Pick a locale from a list of BCP-47 tags, matching on the primary subtag so
 * that "es-AR" and "es-419" both resolve to Spanish.
 */
export function matchLocale(
  preferred: readonly string[],
  fallback: Locale = DEFAULT_LOCALE
): Locale {
  for (const tag of preferred) {
    const primary = tag.toLowerCase().split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return fallback;
}
