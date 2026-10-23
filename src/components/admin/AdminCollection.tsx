import CollectionEditor from "./CollectionEditor";
import { SCHEMAS, type CollectionKey } from "@/data/schema";

interface AdminCollectionProps {
  schemaKey: CollectionKey;
}

/**
 * Resolves a collection key to its schema. `routes.tsx` only knows the keys, so
 * the schemas load with the admin chunk rather than the main bundle.
 */
export default function AdminCollection({ schemaKey }: AdminCollectionProps) {
  return <CollectionEditor schema={SCHEMAS[schemaKey]} />;
}
