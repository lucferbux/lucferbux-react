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

  const thumbnailField =
    schema.fields.find((f) => f.type === "image")?.name ?? "image";

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
      {/* Header sits on the teal band, so it is white like the public
          section headings. */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] leading-[1.1] font-bold text-white drop-shadow-sm max-xs:text-[32px]">
            {schema.label[locale]}
          </h1>
          <p className="mt-1 text-[14px] text-white/75">
            {t.count(rows.length)}
          </p>
        </div>
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
            className="admin-input w-[220px] max-xs:w-[150px]"
          />
          <button
            type="button"
            onClick={onCreate}
            className="admin-btn admin-btn-primary"
          >
            <span aria-hidden="true">+</span> {t.add}
          </button>
        </div>
      </div>

      {rows.length === 0 && (
        <p className="admin-panel p-6 text-[var(--color-admin-muted)]">
          {t.empty}
        </p>
      )}
      {rows.length > 0 && filtered.length === 0 && (
        <p className="admin-panel p-6 text-[var(--color-admin-muted)]">
          {t.noMatches}
        </p>
      )}

      <ul className="grid list-none gap-3 p-0">
        {visible.map((row) => {
          const title =
            localizedField(row, schema.titleField, locale) || row.id;
          return (
            <li
              key={row.id}
              className="admin-panel flex items-center gap-4 p-4 max-xs:flex-col max-xs:items-stretch"
            >
              {/* A thumbnail where the record has one: scanning 37 posts by
                  title alone is slow. */}
              {typeof row[thumbnailField] === "string" &&
                row[thumbnailField] !== "" && (
                  <img
                    src={row[thumbnailField] as string}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-lg object-cover max-xs:hidden"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-semibold text-[var(--color-admin-text)]">
                  {title}
                </p>
                <p className="truncate text-[13px] text-[var(--color-admin-muted)]">
                  {summarise(row)}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  aria-label={`${t.edit}: ${title}`}
                  className="admin-btn admin-btn-ghost px-3 py-1.5 text-sm"
                >
                  {t.edit}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(row)}
                  aria-label={`${t.delete}: ${title}`}
                  className="admin-btn admin-btn-danger px-3 py-1.5 text-sm"
                >
                  {t.delete}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="admin-btn admin-btn-ghost px-3 py-1.5"
          >
            {t.previous}
          </button>
          <span className="text-[var(--color-admin-muted)]">
            {t.page(safePage + 1, pageCount)}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage === pageCount - 1}
            className="admin-btn admin-btn-ghost px-3 py-1.5"
          >
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
}
