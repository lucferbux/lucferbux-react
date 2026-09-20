import { useMemo, useState } from "react";
import type { CollectionSchema } from "@/data/schema";
import { useTranslation } from "@/i18n/LanguageContext";
import { localizedField } from "@/i18n/localized";
import { formatDate, type DateLike } from "@/i18n/formatDate";
import type { Locale } from "@/i18n/locales";

const PAGE_SIZE = 20;

const COPY = {
  en: {
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    empty: "Nothing here yet.",
    noMatches: "No entries match that search.",
    previous: "Previous",
    next: "Next",
    page: (a: number, b: number) => `Page ${a} of ${b}`,
    count: (n: number) => `${n} entries`,
  },
  es: {
    search: "Buscar",
    add: "Añadir",
    edit: "Editar",
    delete: "Eliminar",
    empty: "Todavía no hay nada.",
    noMatches: "Ninguna entrada coincide con la búsqueda.",
    previous: "Anterior",
    next: "Siguiente",
    page: (a: number, b: number) => `Página ${a} de ${b}`,
    count: (n: number) => `${n} entradas`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

interface CollectionListProps {
  schema: CollectionSchema;
  rows: Array<Record<string, unknown> & { id: string }>;
  onCreate: () => void;
  onEdit: (row: Record<string, unknown> & { id: string }) => void;
  onDelete: (row: Record<string, unknown> & { id: string }) => void;
}

/** Normalize for accent- and case-insensitive matching. */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export default function CollectionList({
  schema,
  rows,
  onCreate,
  onEdit,
  onDelete,
}: CollectionListProps) {
  const { locale } = useTranslation();
  const t = COPY[locale];
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const needle = fold(search.trim());
    // Filtered in memory rather than through the Firestore query: the
    // collections are tens of documents, and a server-side text search would
    // need an extension.
    return rows.filter((row) =>
      schema.searchFields.some((field) =>
        fold(localizedField(row, field, locale)).includes(needle)
      )
    );
  }, [rows, search, schema.searchFields, locale]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );

  function summarise(row: Record<string, unknown>): string {
    return schema.fields
      .filter((f) => f.listColumn && f.name !== schema.titleField)
      .map((f) => {
        const value = row[f.name];
        if (f.type === "date") return formatDate(value as DateLike, locale);
        if (f.type === "tags")
          return Array.isArray(value) ? value.join(" · ") : String(value ?? "");
        if (f.i18n) return localizedField(row, f.name, locale);
        return value === undefined || value === null ? "" : String(value);
      })
      .filter(Boolean)
      .join(" · ");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-black dark:text-white">
          {schema.label[locale]}{" "}
          <span className="text-sm font-normal opacity-60">
            {t.count(rows.length)}
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor={`search-${schema.key}`}>
            {t.search}
          </label>
          <input
            id={`search-${schema.key}`}
            type="search"
            value={search}
            placeholder={t.search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-black/15 bg-white/70 px-3 py-2 text-sm text-black transition focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
          />
          <button
            type="button"
            onClick={onCreate}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            + {t.add}
          </button>
        </div>
      </div>

      {rows.length === 0 && (
        <p className="opacity-70 dark:text-white">{t.empty}</p>
      )}
      {rows.length > 0 && filtered.length === 0 && (
        <p className="opacity-70 dark:text-white">{t.noMatches}</p>
      )}

      <ul className="grid list-none gap-3 p-0">
        {visible.map((row) => {
          const title =
            localizedField(row, schema.titleField, locale) || row.id;
          return (
            <li
              key={row.id}
              className="surface-card flex items-center justify-between gap-4 rounded-xl p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-black dark:text-white">
                  {title}
                </p>
                <p className="truncate text-sm opacity-60 dark:text-white">
                  {summarise(row)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  aria-label={`${t.edit}: ${title}`}
                  className="rounded px-3 py-1 text-sm text-primary transition hover:bg-primary/10"
                >
                  {t.edit}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(row)}
                  aria-label={`${t.delete}: ${title}`}
                  className="rounded px-3 py-1 text-sm text-red-500 transition hover:bg-red-500/10"
                >
                  {t.delete}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm dark:text-white">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="rounded border border-black/15 px-3 py-1 disabled:opacity-40 dark:border-white/20"
          >
            {t.previous}
          </button>
          <span>{t.page(safePage + 1, pageCount)}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage === pageCount - 1}
            className="rounded border border-black/15 px-3 py-1 disabled:opacity-40 dark:border-white/20"
          >
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
}
