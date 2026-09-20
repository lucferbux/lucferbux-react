import { useEffect, useMemo, useState } from "react";
import type { DocumentData } from "firebase/firestore";
import { dataSource } from "@datasource";
import type { QueryDescriptor } from "../data/source/types";

interface FirestoreCollectionState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

const EMPTY_QUERY: QueryDescriptor = {};

/**
 * Subscribe to a Firestore collection with real-time updates.
 *
 * The query is a serializable {@link QueryDescriptor} rather than a raw
 * `QueryConstraint[]`, which is what lets this hook depend on the query
 * honestly: a constraint array is a fresh object on every render, so the
 * previous implementation pinned its deps to `[collectionPath]` and silently
 * ignored query changes at runtime.
 *
 * @param collectionPath - Firestore collection path (e.g. "intro", "patent")
 * @param query - where / orderBy / limit clauses
 */
export function useFirestoreCollection<T extends DocumentData>(
  collectionPath: string,
  query: QueryDescriptor = EMPTY_QUERY
): FirestoreCollectionState<T> {
  const [state, setState] = useState<FirestoreCollectionState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  // Callers almost always pass an object literal, so compare by value.
  const queryKey = JSON.stringify(query);

  const stableQuery = useMemo(
    () => JSON.parse(queryKey) as QueryDescriptor,
    [queryKey]
  );

  useEffect(() => {
    // Deliberately no "reset to loading" here: when the query changes we keep
    // showing the previous rows until the new ones arrive, which avoids a
    // spinner flash in fixed-height sections (see the CLS landmine in AGENTS.md).
    return dataSource.subscribe<T>(
      collectionPath,
      stableQuery,
      (data) => setState({ data, loading: false, error: null }),
      (error) => setState((prev) => ({ ...prev, loading: false, error }))
    );
  }, [collectionPath, stableQuery]);

  return state;
}
