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
          className="admin-panel w-full max-w-md p-8 max-xs:p-6"
        >
          <h1 className="mb-1 text-center text-[26px] font-bold text-[var(--color-admin-text)]">
            Admin
          </h1>
          <p className="mb-6 text-center text-sm text-[var(--color-admin-muted)]">
            Sign in to manage the site content
          </p>

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
              className="mb-1.5 block text-sm font-semibold text-[var(--color-admin-text)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-input"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-[var(--color-admin-text)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="admin-btn admin-btn-primary w-full"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
