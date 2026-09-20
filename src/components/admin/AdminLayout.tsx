import { Navigate, NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import WaveShort from "@/components/backgrounds/WaveShort";
import { SCHEMAS } from "@/data/schema";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Fixture builds render the admin without signing in, so the visual baseline
 * can cover the screens behind the auth guard.
 *
 * This is safe because the flag is what swaps Firestore for the in-memory seed
 * corpus: a build with it set has no live data to expose and is never what
 * Netlify publishes (`npm run build` does not set it). A test asserts the
 * bypass is absent from a normal production bundle.
 */
const BYPASS_AUTH_FOR_FIXTURES = import.meta.env.VITE_FIXTURE_DATA === "1";

export default function AdminLayout() {
  const { user, initializing, error } = useAuth();
  const { locale } = useTranslation();

  if (initializing && !BYPASS_AUTH_FOR_FIXTURES) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Token expiry or auth error — send back to login.
  if ((!user || error) && !BYPASS_AUTH_FOR_FIXTURES) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    // `data-page="short"` selects the WaveShort gradient for the floating bar,
    // exactly as the public site does.
    <div data-page="short" className="relative min-h-screen">
      <WaveShort />

      {/* Same technique as the public header: opaque, so Safari can sample it
          for the toolbar tint, painting the page's own gradient at the page's
          own geometry so there is no visible seam. */}
      <header className="page-tint-bar fixed top-0 right-0 left-0 z-50 pt-[env(safe-area-inset-top,0px)]">
        <nav
          aria-label="Admin"
          className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6 max-md:px-4"
        >
          <Link
            to="/admin/dashboard"
            className="text-lg font-bold text-white no-underline drop-shadow-sm"
          >
            Admin
          </Link>

          <div className="flex items-center gap-1">
            {Object.values(SCHEMAS).map((schema) => (
              <NavLink
                key={schema.key}
                to={`/admin/${schema.key}`}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-1.5 text-sm font-medium no-underline transition max-md:px-2 max-md:text-[13px]",
                    isActive
                      ? "bg-white/90 text-black"
                      : "text-white/85 hover:bg-white/15 hover:text-white",
                  ].join(" ")
                }
              >
                {schema.label[locale]}
              </NavLink>
            ))}
            <Link
              to="/"
              aria-label="Back to site"
              className="ml-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white/85 no-underline transition hover:bg-white/15 hover:text-white max-md:ml-0 max-md:px-2"
            >
              ↗
            </Link>
          </div>
        </nav>
      </header>

      <main
        id="admin-main"
        tabIndex={-1}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-[120px] pb-20 max-md:px-4"
      >
        <Outlet />
      </main>
    </div>
  );
}
