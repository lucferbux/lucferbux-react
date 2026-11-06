import { getStorage } from "firebase/storage";
import { app } from "./firebase";

/** Admin-only: kept out of `firebase.ts` so the public bundle has no Storage SDK. */
export const storage = getStorage(app);
