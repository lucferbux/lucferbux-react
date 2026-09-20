import type { DocumentData } from "firebase/firestore";
import intro from "../../../seed/v1/intro.json";
import patent from "../../../seed/v1/patent.json";
import project from "../../../seed/v1/project.json";
import team from "../../../seed/v1/team.json";
import type { DataSource, QueryDescriptor } from "./types";

/**
 * In-memory data source backed by the versioned seed corpus in `seed/v1/`.
 *
 * Enabled by building with `VITE_FIXTURE_DATA=1`. Used by the Playwright visual
 * baseline (so screenshots never depend on live Firestore) and by `npm run
 * dev:fixtures` (so the app runs without credentials). The same corpus is the
 * input to `scripts/seed.ts`, so there is exactly one copy of the content.
 */

/** Fields stored as Firestore timestamps, by collection. */
const TIMESTAMP_FIELDS: Record<string, readonly string[]> = {
  intro: ["timestamp"],
  patent: ["date"],
  project: ["date"],
  team: [],
};

/** Shape of `Timestamp` that the card components actually branch on. */
interface TimestampLike {
  seconds: number;
  nanoseconds: number;
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return typeof value === "object" && value !== null && "seconds" in value;
}

function toTimestampLike(iso: string): TimestampLike {
  const ms = Date.parse(iso);
  return {
    seconds: Math.floor(ms / 1000),
    nanoseconds: (ms % 1000) * 1e6,
  };
}

function hydrate(
  collectionPath: string,
  rows: Record<string, unknown>[]
): Record<string, unknown>[] {
  const timestampFields = TIMESTAMP_FIELDS[collectionPath] ?? [];

  return rows.map((row) => {
    const { _id, ...rest } = row;
    const hydrated: Record<string, unknown> = { id: _id, ...rest };
    for (const field of timestampFields) {
      const raw = hydrated[field];
      if (typeof raw === "string") hydrated[field] = toTimestampLike(raw);
    }
    return hydrated;
  });
}

const COLLECTIONS: Record<string, Record<string, unknown>[]> = {
  intro: hydrate("intro", intro as Record<string, unknown>[]),
  patent: hydrate("patent", patent as Record<string, unknown>[]),
  project: hydrate("project", project as Record<string, unknown>[]),
  team: hydrate("team", team as Record<string, unknown>[]),
};

/** Ordering key that matches Firestore's semantics closely enough for layout. */
function sortKey(value: unknown): number | string {
  if (isTimestampLike(value)) return value.seconds;
  if (typeof value === "number" || typeof value === "string") return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  return "";
}

function compare(a: unknown, b: unknown): number {
  const left = sortKey(a);
  const right = sortKey(b);
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return String(left).localeCompare(String(right));
}

function matches(
  row: Record<string, unknown>,
  [field, op, value]: NonNullable<QueryDescriptor["where"]>[number]
): boolean {
  const actual = row[field];
  switch (op) {
    case "==":
      return actual === value;
    case "!=":
      return actual !== value;
    case ">":
      return compare(actual, value) > 0;
    case ">=":
      return compare(actual, value) >= 0;
    case "<":
      return compare(actual, value) < 0;
    case "<=":
      return compare(actual, value) <= 0;
    case "in":
      return Array.isArray(value) && value.includes(actual);
    case "not-in":
      return Array.isArray(value) && !value.includes(actual);
    case "array-contains":
      return Array.isArray(actual) && actual.includes(value);
    case "array-contains-any":
      return (
        Array.isArray(actual) &&
        Array.isArray(value) &&
        value.some((v) => actual.includes(v))
      );
    default:
      return true;
  }
}

export function queryFixtures<T extends DocumentData>(
  collectionPath: string,
  descriptor: QueryDescriptor
): T[] {
  let rows = COLLECTIONS[collectionPath];
  if (!rows) {
    throw new Error(`No fixture data for collection "${collectionPath}"`);
  }

  for (const clause of descriptor.where ?? []) {
    rows = rows.filter((row) => matches(row, clause));
  }

  for (const [field, direction] of [...(descriptor.orderBy ?? [])].reverse()) {
    rows = [...rows].sort((a, b) => {
      const result = compare(a[field], b[field]);
      return direction === "desc" ? -result : result;
    });
  }

  if (descriptor.limit !== undefined) rows = rows.slice(0, descriptor.limit);

  return rows as unknown as T[];
}

export const dataSource: DataSource = {
  subscribe<T extends DocumentData>(
    collectionPath: string,
    descriptor: QueryDescriptor,
    onData: (rows: T[]) => void,
    onError: (error: Error) => void
  ) {
    try {
      onData(queryFixtures<T>(collectionPath, descriptor));
    } catch (error) {
      onError(error as Error);
    }
    return () => {};
  },
};
