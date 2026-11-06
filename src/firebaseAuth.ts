import { getAuth } from "firebase/auth";
import { app } from "./firebase";

/** Admin-only: kept out of `firebase.ts` so the public bundle has no Auth SDK. */
export const auth = getAuth(app);
