import { useId } from "react";
import type { FieldSchema } from "@/data/schema";
import type { Locale } from "@/i18n/locales";

const LANGUAGE_NAME: Record<Locale, Record<Locale, string>> = {
  en: { en: "English", es: "Spanish" },
  es: { en: "Inglés", es: "Español" },
};
import ImageField from "./ImageField";

interface FieldProps {
  schema: FieldSchema;
  /** Distinguishes the two controls of a localized field. */
  valueLocale?: Locale;
  uiLocale: Locale;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

const inputClass = "admin-input";

function resolveOptions(schema: FieldSchema) {
  if (!schema.options) return [];
  return typeof schema.options === "function"
    ? schema.options()
    : schema.options;
}

/**
 * One labelled form control, driven entirely by the schema.
 *
 * Every control has an id and a `<label htmlFor>`, `aria-invalid` and
 * `aria-describedby`. The previous editors rendered the raw Firestore key as
 * the label text ("title_en") and never associated it with its input.
 */
export default function Field({
  schema,
  valueLocale,
  uiLocale,
  value,
  error,
  onChange,
}: FieldProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  const label = valueLocale
    ? `${schema.label[uiLocale]} (${LANGUAGE_NAME[uiLocale][valueLocale]})`
    : schema.label[uiLocale];

  const describedBy =
    [schema.help ? helpId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const common = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: inputClass,
  };

  function control() {
    switch (schema.type) {
      case "textarea":
      case "markdown":
        return (
          <textarea
            {...common}
            rows={schema.type === "markdown" ? 14 : 4}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "boolean":
        return (
          <input
            {...common}
            type="checkbox"
            className="h-5 w-5 rounded accent-[var(--color-primary)]"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
        );
      case "number":
        return (
          <input
            {...common}
            type="number"
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) =>
              onChange(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          />
        );
      case "date":
        return (
          <input
            {...common}
            type="date"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "select":
        return (
          <select
            {...common}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          >
            {resolveOptions(schema).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "image":
        return (
          <ImageField
            id={id}
            describedBy={describedBy}
            storagePath={schema.storagePath ?? "images/misc"}
            value={String(value ?? "")}
            uiLocale={uiLocale}
            onChange={onChange}
          />
        );
      case "linklist":
        return (
          <textarea
            {...common}
            rows={4}
            value={
              Array.isArray(value)
                ? (value as { label: string; url: string }[])
                    .map((link) => `${link.label} | ${link.url}`)
                    .join("\n")
                : String(value ?? "")
            }
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "tags":
        return (
          <input
            {...common}
            type="text"
            value={
              Array.isArray(value) ? value.join(", ") : String(value ?? "")
            }
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "url":
        return (
          <input
            {...common}
            type="url"
            inputMode="url"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      default:
        return (
          <input
            {...common}
            type="text"
            maxLength={schema.maxLength}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  }

  const isCheckbox = schema.type === "boolean";

  return (
    <div className={isCheckbox ? "flex items-center gap-2" : undefined}>
      <label
        htmlFor={id}
        className={
          isCheckbox
            ? "order-2 text-sm font-medium text-[var(--color-admin-text)]"
            : "mb-1.5 block text-sm font-semibold text-[var(--color-admin-text)]"
        }
      >
        {label}
        {schema.required && (
          <span aria-hidden="true" className="ml-1 text-[var(--color-danger)]">
            *
          </span>
        )}
      </label>
      {control()}
      {schema.help && (
        <p
          id={helpId}
          className="mt-1 text-xs text-black/50 dark:text-white/50"
        >
          {schema.help[uiLocale]}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-1.5 text-xs font-medium text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
