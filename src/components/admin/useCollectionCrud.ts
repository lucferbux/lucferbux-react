import { useCallback, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import type { CollectionSchema } from "@/data/schema";

export interface CrudError {
  code: string;
  message: { en: string; es: string };
}

/** Firebase error codes worth naming; anything else falls back to generic. */
const ERROR_MESSAGES: Record<string, CrudError["message"]> = {
  "permission-denied": {
    en: "You do not have permission to make this change.",
    es: "No tienes permisos para hacer este cambio.",
  },
  unavailable: {
    en: "Could not reach the database. Check your connection and try again.",
    es: "No se pudo conectar con la base de datos. Revisa tu conexión e inténtalo de nuevo.",
  },
  "failed-precondition": {
    en: "The database rejected this change. It may need an index.",
    es: "La base de datos rechazó el cambio. Puede que falte un índice.",
  },
  unauthenticated: {
    en: "Your session expired. Sign in again.",
    es: "Tu sesión ha caducado. Vuelve a iniciar sesión.",
  },
};

function toCrudError(error: unknown): CrudError {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code).replace(/^firestore\//, "")
      : "unknown";

  return {
    code,
    message: ERROR_MESSAGES[code] ?? {
      en: `Could not save the change (${code}).`,
      es: `No se pudo guardar el cambio (${code}).`,
    },
  };
}

/** Convert an `<input type="date">` value back into a Firestore Timestamp. */
export function dateInputToTimestamp(value: string): Timestamp {
  return Timestamp.fromDate(new Date(`${value}T12:00:00Z`));
}

export function useCollectionCrud(schema: CollectionSchema) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<CrudError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Create or update.
   *
   * `id` is optional so a document can be seeded with a deterministic id
   * (`setDoc`) rather than always getting a generated one. The previous
   * editors only ever called `addDoc`, so there was no upsert path and the
   * seed script could not agree with the UI on document identity.
   */
  const save = useCallback(
    async (payload: Record<string, unknown>, id?: string): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        if (id) {
          await updateDoc(doc(db, schema.path, id), payload);
        } else {
          // deleteField() sentinels are only meaningful in an update; a new
          // document has no legacy fields to remove.
          const clean = Object.fromEntries(
            Object.entries(payload).filter(
              ([, value]) =>
                !(
                  typeof value === "object" &&
                  value !== null &&
                  "_methodName" in (value as Record<string, unknown>)
                )
            )
          );
          if (typeof clean._id === "string" && clean._id) {
            const { _id, ...rest } = clean;
            await setDoc(doc(db, schema.path, _id as string), rest);
          } else {
            await addDoc(collection(db, schema.path), clean);
          }
        }
        return true;
      } catch (err) {
        setError(toCrudError(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [schema.path]
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);
      try {
        await deleteDoc(doc(db, schema.path, id));
        return true;
      } catch (err) {
        setError(toCrudError(err));
        return false;
      }
    },
    [schema.path]
  );

  return { save, remove, saving, error, clearError };
}
