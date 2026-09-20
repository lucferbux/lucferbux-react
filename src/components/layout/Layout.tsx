import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useTranslation } from "../../i18n/LanguageContext";

/**
 * Which background each route paints at the top of the page. The fixed header
 * reads this to tint itself identically, which is both a visual concern and how
 * Safari 26 decides what colour to make its toolbar.
 */
/** Routes rendering WaveBody, an 800px gradient. */
const BODY_ROUTES = new Set(["news", "posts", "projects", "blog", "teaching"]);

function pageKind(pathname: string): "home" | "body" | "short" {
  const withoutLocale = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
  const segment = withoutLocale.split("/")[1] ?? "";

  if (segment === "") return "home";
  if (BODY_ROUTES.has(segment)) return "body";
  // /terms, /privacy and the 404 all render WaveShort, a 400px gradient.
  return "short";
}

export default function Layout() {
  const { pathname } = useLocation();
  const { m } = useTranslation();

  // React Router 7 only ships <ScrollRestoration> in framework mode, so a SPA
  // navigation otherwise keeps the previous scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div data-page={pageKind(pathname)}>
      <a
        href="#main"
        className="sr-only rounded-lg bg-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100]"
      >
        {m.a11y.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
