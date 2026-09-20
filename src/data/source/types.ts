import type { DocumentData, WhereFilterOp } from "firebase/firestore";

/**
 * A serializable description of a Firestore query.
 *
 * Components pass this instead of raw `QueryConstraint[]` for two reasons:
 *  1. it can be JSON-stringified, so `useFirestoreCollection` can use it as an
 *     effect dependency and actually re-subscribe when the query changes
 *     (raw constraint arrays are fresh object identities on every render, which
 *     is why the hook used to pin its deps to `[collectionPath]` alone);
 *  2. the fixture data source can evaluate it in memory without Firebase.
 */
export interface QueryDescriptor {
  where?: Array<[field: string, op: WhereFilterOp, value: unknown]>;
  orderBy?: Array<[field: string, direction: "asc" | "desc"]>;
  limit?: number;
}

export interface DataSource {
  subscribe<T extends DocumentData>(
    collectionPath: string,
    query: QueryDescriptor,
    onData: (rows: T[]) => void,
    onError: (error: Error) => void
  ): () => void;
}
