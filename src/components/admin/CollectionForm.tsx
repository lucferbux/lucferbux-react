import { useEffect, useRef, useState } from "react";
import { Timestamp, deleteField } from "firebase/firestore";
import type { CollectionSchema, FieldSchema } from "@/data/schema";
import { REQUIRED_MESSAGE } from "@/data/schema";
import { LOCALES, type Locale } from "@/i18n/locales";
import { useTranslation } from "@/i18n/LanguageContext";
import { toDate } from "@/i18n/formatDate";
import Field from "./fields/Field";

export type FormValues = Record<string, unknown>;

interface CollectionFormProps {
  schema: CollectionSchema;
  initial: FormValues | null;
  saving: boolean;
  /** Surfaced above the submit button as well as in a toast. */
  saveError?: string;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

const COPY = {
  en: {
    create: "Create",
    edit: "Edit",
    save: "Save",
    saving: "Saving…",
    cancel: "Cancel",
    problems: (n: number) =>
      `${n} field${n === 1 ? "" : "s"} need${n === 1 ? "s" : ""} attention`,
  },
  es: {
    create: "Crear",
    edit: "Editar",
    save: "Guardar",
    saving: "Guardando…",
    cancel: "Cancelar",
    problems: (n: number) =>
      n === 1 ? "1 campo necesita atención" : `${n} campos necesitan atención`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

/** A date value in whatever shape, as `yyyy-mm-dd` for `<input type="date">`. */
function toDateInput(value: unknown): string {
  const date = toDate(value as never);
  return date ? date.toISOString().slice(0, 10) : "";
}

function editableFields(schema: CollectionSchema): FieldSchema[] {
  return schema.fields.filter((f) => !f.hidden);
}

/** Flatten a document into form state, one entry per control. */
export function toFormValues(
  schema: CollectionSchema,
  doc: FormValues | null
): FormValues {
  const values: FormValues = {};

  for (const field of schema.fields) {
    if (field.i18n) {
      const raw = doc?.[field.name];
      const nested =
        typeof raw === "object" && raw !== null && !Array.isArray(raw)
          ? (raw as Record<string, string>)
          : null;

      for (const locale of LOCALES) {
        values[`${field.name}.${locale}`] = nested
          ? (nested[locale] ?? "")
          : // Legacy shape: the bare field is Spanish, `_en` is English.
            locale === "en"
            ? ((doc?.[`${field.name}_en`] as string) ?? "")
            : ((doc?.[field.name] as string) ?? "");
      }
      continue;
    }

    if (field.type === "date") {
      values[field.name] = toDateInput(doc?.[field.name]);
      continue;
    }

    if (field.type === "tags") {
      const raw = doc?.[field.name];
      values[field.name] = Array.isArray(raw) ? raw.join(", ") : (raw ?? "");
      continue;
    }

    values[field.name] = doc?.[field.name] ?? field.defaultValue ?? "";
  }

  return values;
}

/** Build the Firestore payload from form state. */
export function toPayload(
  schema: CollectionSchema,
  values: FormValues
): FormValues {
  const payload: FormValues = {};

  for (const field of schema.fields) {
    if (field.i18n) {
      payload[field.name] = Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          String(values[`${field.name}.${locale}`] ?? "").trim(),
        ])
      );
      // The nested map supersedes the legacy English sibling. Without this an
      // edited document would carry both `title: {en, es}` and `title_en`.
      payload[`${field.name}_en`] = deleteField();
      continue;
    }

    const value = values[field.name];

    if (field.type === "date") {
      // Only the calendar day is editable, so noon UTC avoids a value landing
      // on the previous day in western timezones.
      payload[field.name] = value
        ? Timestamp.fromDate(new Date(`${String(value)}T12:00:00Z`))
        : Timestamp.now();
      continue;
    }

    if (field.type === "tags") {
      payload[field.name] = String(value ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      continue;
    }

    if (field.type === "number") {
      payload[field.name] = typeof value === "number" ? value : Number(value);
      continue;
    }

    if (field.type === "boolean") {
      payload[field.name] = Boolean(value);
      continue;
    }

    payload[field.name] = typeof value === "string" ? value.trim() : value;
  }

  return payload;
}

export function validate(
  schema: CollectionSchema,
  values: FormValues,
  uiLocale: Locale
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of editableFields(schema)) {
    const keys = field.i18n
      ? LOCALES.map((locale) => `${field.name}.${locale}`)
      : [field.name];

    for (const key of keys) {
      const value = values[key];

      if (
        field.required &&
        (value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === ""))
      ) {
        errors[key] = REQUIRED_MESSAGE[uiLocale];
        continue;
      }

      if (field.validate) {
        const message = field.validate(
          field.type === "number" && typeof value === "string" && value !== ""
            ? Number(value)
            : value
        );
        if (message) errors[key] = message[uiLocale];
      }
    }
  }

  return errors;
}

export default function CollectionForm({
  schema,
  initial,
  saving,
  saveError,
  onSubmit,
  onCancel,
}: CollectionFormProps) {
  const { locale, m } = useTranslation();
  const t = COPY[locale];
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(schema, initial)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLDivElement>(null);

  // Focus the first control when the form appears, so keyboard users are not
  // left on a button that has just unmounted. Reset is handled by the parent
  // remounting this component with a new key, not by an effect.
  useEffect(() => {
    const first = firstFieldRef.current?.querySelector<HTMLElement>(
      "input, textarea, select"
    );
    first?.focus();
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(schema, values, locale);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Announce rather than disable the button: a disabled submit hides *why*.
      summaryRef.current?.focus();
      return;
    }

    onSubmit(toPayload(schema, values));
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={`${initial ? t.edit : t.create} ${schema.label[locale]}`}
      className="surface-card rounded-xl p-6"
    >
      <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
        {initial ? t.edit : t.create} · {schema.label[locale]}
      </h2>

      <div
        ref={summaryRef}
        tabIndex={-1}
        aria-live="assertive"
        className="focus:outline-none"
      >
        {errorCount > 0 && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
          >
            {t.problems(errorCount)}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {editableFields(schema).map((field, index) => (
          <div key={field.name} ref={index === 0 ? firstFieldRef : undefined}>
            {field.i18n ? (
              <fieldset className="grid gap-3 rounded-lg border border-black/10 p-3 dark:border-white/15">
                <legend className="px-1 text-sm font-medium text-black/80 dark:text-white/80">
                  {field.label[locale]}
                </legend>
                {LOCALES.map((valueLocale) => (
                  <Field
                    key={valueLocale}
                    schema={field}
                    valueLocale={valueLocale}
                    uiLocale={locale}
                    value={values[`${field.name}.${valueLocale}`]}
                    error={errors[`${field.name}.${valueLocale}`]}
                    onChange={(next) =>
                      setValues((prev) => ({
                        ...prev,
                        [`${field.name}.${valueLocale}`]: next,
                      }))
                    }
                  />
                ))}
              </fieldset>
            ) : (
              <Field
                schema={field}
                uiLocale={locale}
                value={values[field.name]}
                error={errors[field.name]}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, [field.name]: next }))
                }
              />
            )}
          </div>
        ))}
      </div>

      {saveError && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
        >
          {saveError}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? t.saving : t.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-black/15 px-4 py-2 transition hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
        >
          {t.cancel}
        </button>
      </div>

      <p className="sr-only">{m.common.loading}</p>
    </form>
  );
}
