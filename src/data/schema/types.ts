import type { Locale } from "../../i18n/locales";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "url"
  | "image"
  | "date"
  | "number"
  | "boolean"
  | "tags"
  | "select"
  | "linklist";

/** Human-readable label or help text, per locale. */
export type LocalizedLabel = Record<Locale, string>;

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  /** Firestore field key. */
  name: string;
  type: FieldType;
  label: LocalizedLabel;
  /**
   * The value is localized, so the editor renders one control per language and
   * writes `{ en, es }`.
   */
  i18n?: boolean;
  required?: boolean;
  help?: LocalizedLabel;
  maxLength?: number;
  /** Returns an error message key, or null when valid. */
  validate?: (value: unknown) => LocalizedLabel | null;
  /** Storage prefix for `type: "image"`. */
  storagePath?: string;
  /** Options for `type: "select"`; a function is resolved at render time. */
  options?: SelectOption[] | (() => SelectOption[]);
  /** Show this field as a column in the list view. */
  listColumn?: boolean;
  /** Present in the document but not editable (legacy fields). */
  hidden?: boolean;
  defaultValue?: unknown;
}

export interface CollectionSchema {
  /** Route segment under /admin. */
  key: string;
  /**
   * Firestore collection name. These are LEGACY and do not match the domain
   * language — News is `intro`, Posts is `patent`, Work is `team`. Renaming
   * them would orphan the live data.
   */
  path: string;
  label: LocalizedLabel;
  icon: string;
  /** Field used as the row heading in the list. */
  titleField: string;
  defaultSort: { field: string; dir: "asc" | "desc" };
  /** Fields searched by the list filter. */
  searchFields: string[];
  fields: FieldSchema[];
}
