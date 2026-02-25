import { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase";

interface FirestoreDocumentState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic hook for fetching a single Firestore document (one-time read).
 *
 * @param collectionPath - Firestore collection path
 * @param docId - Document ID to fetch
 * @returns { data, loading, error }
 */
export function useFirestoreDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string | undefined
): FirestoreDocumentState<T> {
  const [state, setState] = useState<FirestoreDocumentState<T>>({
    data: null,
    loading: !!docId,
    error: null,
  });

  useEffect(() => {
    if (!docId) {
      return;
    }

    const fetchDoc = async () => {
      try {
        const docRef = doc(db, collectionPath, docId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setState({
            data: { id: snapshot.id, ...snapshot.data() } as unknown as T,
            loading: false,
            error: null,
          });
        } else {
          setState({ data: null, loading: false, error: null });
        }
      } catch (error) {
        console.error(
          `Firestore error on document "${collectionPath}/${docId}":`,
          error
        );
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchDoc();
  }, [collectionPath, docId]);

  return state;
}
