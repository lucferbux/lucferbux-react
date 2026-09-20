import { useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase";

interface AuthState {
  user: User | null;
  /**
   * True only while the initial auth-state subscription is settling.
   *
   * This used to be a single `loading` flag that `signIn` also set, which made
   * the guard in LoginForm replace the entire form mid-submit — and rendered
   * its own `disabled={loading}` / "Signing in…" branch unreachable. The two
   * states are now separate.
   */
  initializing: boolean;
  submitting: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setInitializing(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setInitializing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }, []);

  return { user, initializing, submitting, error, signIn, signOut };
}
