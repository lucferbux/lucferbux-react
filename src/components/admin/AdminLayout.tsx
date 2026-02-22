import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import WaveShort from "@/components/backgrounds/WaveShort";

export default function AdminLayout() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Token expiry or auth error — redirect to login with message
  if (!user || error) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Wave background */}
      <WaveShort />

      {/* Glass nav bar */}
      <nav className="relative z-20 border-b border-white/10 bg-[rgba(66,66,66,0.3)] px-6 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/admin/dashboard" className="text-lg font-bold text-white drop-shadow-sm">
            Admin Panel
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="text-sm text-white/80 transition hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/"
              className="text-sm text-white/80 transition hover:text-primary"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </nav>

      {/* Content area */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
