import { useState } from "react";
import type { CollectionSchema } from "@/data/schema";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useTranslation } from "@/i18n/LanguageContext";
import { localizedField } from "@/i18n/localized";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CollectionForm, { type FormValues } from "./CollectionForm";
import CollectionList from "./CollectionList";
import ConfirmDialog from "./ConfirmDialog";
import { useCollectionCrud } from "./useCollectionCrud";

type Row = Record<string, unknown> & { id: string };

interface CollectionEditorProps {
  schema: CollectionSchema;
}

/**
 * One editor for every collection, driven by a `CollectionSchema`.
 *
 * Replaces four near-identical ~190-line components. Beyond the duplication,
 * those shared a set of defects this fixes: `Timestamp.now()` was written on
 * every update so editing an old item silently re-dated it; failed writes only
 * reached `console.error`, so a permission error looked exactly like success;
 * there was no validation, no `<form>`, and labels were raw Firestore keys with
 * no association to their inputs.
 */
export default function CollectionEditor({ schema }: CollectionEditorProps) {
  const { locale } = useTranslation();
  const { data, loading, error } = useFirestoreCollection<Row>(schema.path, {
    orderBy: [[schema.defaultSort.field, schema.defaultSort.dir]],
  });

  const {
    save,
    remove,
    saving,
    error: crudError,
    clearError,
  } = useCollectionCrud(schema);

  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<Row | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);

  function backToList() {
    setMode("list");
    setEditing(null);
    clearError();
  }

  async function handleSubmit(values: FormValues) {
    const ok = await save(values, editing?.id);
    // Stay on the form when the write fails, with the error visible.
    if (ok) backToList();
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    const row = pendingDelete;
    setPendingDelete(null);
    await remove(row.id);
  }

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <p role="alert" className="text-red-500">
        {error.message}
      </p>
    );

  return (
    <>
      {mode === "list" ? (
        <>
          {crudError && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
            >
              {crudError.message[locale]}
            </p>
          )}
          <CollectionList
            schema={schema}
            rows={data}
            onCreate={() => {
              clearError();
              setEditing(null);
              setMode("create");
            }}
            onEdit={(row) => {
              clearError();
              setEditing(row);
              setMode("edit");
            }}
            onDelete={setPendingDelete}
          />
        </>
      ) : (
        <CollectionForm
          key={editing?.id ?? "new"}
          schema={schema}
          initial={editing}
          saving={saving}
          saveError={crudError?.message[locale]}
          onSubmit={handleSubmit}
          onCancel={backToList}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        subject={
          pendingDelete
            ? localizedField(pendingDelete, schema.titleField, locale) ||
              pendingDelete.id
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
