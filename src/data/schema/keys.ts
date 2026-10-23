/**
 * The admin's collection keys, which are also its route segments.
 *
 * Kept apart from the schemas so `routes.tsx` can declare the admin routes
 * without importing the schemas themselves, which pull in the post index (and
 * with it every article body). `SCHEMAS` is checked against this list.
 *
 * The routes must be static: `/admin/:collection` would tie with the public
 * `/:lang/news` in React Router's ranking, and `/admin/*` would lose to it.
 */
export const COLLECTION_KEYS = [
  "news",
  "posts",
  "projects",
  "work",
  "teaching",
] as const;

export type CollectionKey = (typeof COLLECTION_KEYS)[number];
