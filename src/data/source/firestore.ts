import {
  collection,
  limit as limitTo,
  onSnapshot,
  orderBy as orderByField,
  query as buildQuery,
  where as whereField,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { DataSource, QueryDescriptor } from "./types";

function toConstraints(descriptor: QueryDescriptor): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];

  for (const [field, op, value] of descriptor.where ?? []) {
    constraints.push(whereField(field, op, value));
  }
  for (const [field, direction] of descriptor.orderBy ?? []) {
    constraints.push(orderByField(field, direction));
  }
  if (descriptor.limit !== undefined) {
    constraints.push(limitTo(descriptor.limit));
  }

  return constraints;
}

export const dataSource: DataSource = {
  subscribe<T extends DocumentData>(
    collectionPath: string,
    descriptor: QueryDescriptor,
    onData: (rows: T[]) => void,
    onError: (error: Error) => void
  ) {
    const q = buildQuery(
      collection(db, collectionPath),
      ...toConstraints(descriptor)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        onData(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as unknown as T[]
        );
      },
      (error) => {
        console.error(
          `Firestore error on collection "${collectionPath}":`,
          error
        );
        onError(error);
      }
    );
  },
};
