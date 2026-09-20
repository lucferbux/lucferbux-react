import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import WaveShort from "@/components/backgrounds/WaveShort";

export default function AdminLayout() {
  const { user, initializing, error } = useAuth();

  if (initializing) {
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
      <nav
        aria-label="Admin"
        className="surface-card relative z-20 border-x-0 border-t-0 px-6 py-3"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            to="/admin/dashboard"
            className="text-lg font-bold text-black no-underline dark:text-white"
          >
            Admin Panel
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="text-sm text-black/80 no-underline transition hover:text-primary dark:text-white/80"
            >
              Dashboard
            </Link>
            <Link
              to="/"
              className="text-sm text-black/80 no-underline transition hover:text-primary dark:text-white/80"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </nav>

      {/* Content area */}
      <main
        id="admin-main"
        className="relative z-10 mx-auto max-w-5xl px-6 py-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
