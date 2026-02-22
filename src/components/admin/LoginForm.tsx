import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import WaveShort from "@/components/backgrounds/WaveShort";

export default function LoginForm() {
  const { user, signIn, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already authenticated, redirect to dashboard
  if (loading) {
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
          className="w-full max-w-md rounded-xl border border-white/10 bg-[rgba(66,66,66,0.3)] p-8 shadow-lg backdrop-blur-[40px]"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-primary">
            Admin Login
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-400">
              {error.message}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-white/80"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-white/80"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
