import { INTL_LOCALE, type Locale } from "./locales";

/** Every date shape the app receives from Firestore, fixtures or frontmatter. */
export type DateLike =
  | Date
  | number
  | string
  | { seconds: number; nanoseconds?: number }
  | { toDate: () => Date };

export function toDate(value: DateLike): Date | null {
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : new Date(parsed);
  }
  if (value && typeof value === "object") {
    if ("toDate" in value && typeof value.toDate === "function") {
      return value.toDate();
    }
    if ("seconds" in value && typeof value.seconds === "number") {
      return new Date(value.seconds * 1000);
    }
  }
  return null;
}

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

// Constructing an Intl.DateTimeFormat is expensive and /news renders 18+ cards,
// so instances are reused.
const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  locale: Locale,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(INTL_LOCALE[locale], options);
    formatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Format a date in the app's locale.
 *
 * The cards previously called `toLocaleDateString([])`, which uses the
 * *browser's* locale — so switching the site to Spanish left the dates in
 * whatever language the visitor's OS happened to be.
 */
export function formatDate(
  value: DateLike,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS
): string {
  const date = toDate(value);
  if (!date) return "";
  return getFormatter(locale, options).format(date);
}
