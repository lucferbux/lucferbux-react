import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Only what the public site needs. Auth and Storage live in
 * `firebaseAuth.ts` / `firebaseStorage.ts`, which only the lazily loaded admin
 * imports — importing them here would put both SDKs in every visitor's bundle.
 */
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
