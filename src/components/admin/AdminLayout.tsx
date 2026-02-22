import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

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
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <nav className="border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <a
              href="/admin/dashboard"
              className="text-sm text-gray-600 hover:text-primary dark:text-gray-300"
            >
              Dashboard
            </a>
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-primary dark:text-gray-300"
            >
              Back to Site
            </a>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
