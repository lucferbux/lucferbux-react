import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";

const LOCAL_KEY = resolve(process.cwd(), "scripts/serviceAccount.json");

/**
 * Initialise the Admin SDK.
 *
 * Credentials come from, in order:
 *  1. `FIRESTORE_EMULATOR_HOST` — no credentials needed at all, which is how
 *     the seed can be rehearsed end to end before anyone hands over a key;
 *  2. `GOOGLE_APPLICATION_CREDENTIALS`;
 *  3. `scripts/serviceAccount.json` (gitignored).
 */
export function initAdmin({ projectId } = {}) {
  if (getApps().length > 0) return getApps()[0];

  const resolvedProjectId =
    projectId ??
    process.env.FIREBASE_PROJECT_ID ??
    readProjectIdFromRc() ??
    "lucferbux-web-page";

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return initializeApp({ projectId: resolvedProjectId });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ projectId: resolvedProjectId });
  }

  if (existsSync(LOCAL_KEY)) {
    const key = JSON.parse(readFileSync(LOCAL_KEY, "utf8"));
    return initializeApp({
      credential: cert(key),
      projectId: key.project_id ?? resolvedProjectId,
      storageBucket: `${key.project_id ?? resolvedProjectId}.appspot.com`,
    });
  }

  throw new Error(
    [
      "No Firebase credentials found. Use one of:",
      "  • FIRESTORE_EMULATOR_HOST=localhost:8080  (no credentials needed)",
      "  • GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json",
      "  • place a service account key at scripts/serviceAccount.json",
    ].join("\n")
  );
}

function readProjectIdFromRc() {
  const rc = resolve(process.cwd(), ".firebaserc");
  if (!existsSync(rc)) return null;
  try {
    return JSON.parse(readFileSync(rc, "utf8"))?.projects?.default ?? null;
  } catch {
    return null;
  }
}
