import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";

interface FirestoreCollectionState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * Generic hook for subscribing to a Firestore collection with real-time updates.
 *
 * @param collectionPath - Firestore collection path (e.g. "intro", "patent")
 * @param constraints - Optional array of QueryConstraints (orderBy, where, limit, etc.)
 * @returns { data, loading, error }
 */
export function useFirestoreCollection<T extends DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): FirestoreCollectionState<T> {
  const [state, setState] = useState<FirestoreCollectionState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const colRef = collection(db, collectionPath);
    const q = query(colRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[];
        setState({ data: docs, loading: false, error: null });
      },
      (error) => {
        console.error(
          `Firestore error on collection "${collectionPath}":`,
          error
        );
        setState((prev) => ({ ...prev, loading: false, error }));
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath]);

  return state;
}
