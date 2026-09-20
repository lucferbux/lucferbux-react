import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import WaveShort from "@/components/backgrounds/WaveShort";

export default function LoginForm() {
  const { user, signIn, initializing, submitting, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Gate on `initializing` only. Gating on the submit state would unmount the
  // whole form mid-login, which is what made the button's own pending state
  // unreachable.
  if (initializing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch {
      // error is captured in useAuth state
    }
  };

  return (
    <div className="relative min-h-[60vh]">
      <WaveShort />
      <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="surface-card w-full max-w-md rounded-xl p-8"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-primary">
            Admin Login
          </h2>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
            >
              {error.message}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-black/80 dark:text-white/80"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-black/15 bg-white/70 px-4 py-2 text-black transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-black/80 dark:text-white/80"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-black/15 bg-white/70 px-4 py-2 text-black transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
