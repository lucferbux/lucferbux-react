import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import TabBar from "./TabBar";
import Footer from "./Footer";
import { useTranslation } from "../../i18n/LanguageContext";
import { stripLocale } from "../../i18n/stripLocale";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Which background each route paints at the top of the page. globals.css keys
 * the colour of the browser canvas on it (see "Page tint" there), which is what
 * shows behind the iPhone status bar and in Safari's toolbar.
 */
/** Routes rendering WaveBody, an 800px gradient. */
const BODY_ROUTES = new Set(["news", "posts", "projects", "blog", "teaching"]);

function pageKind(pathname: string): "home" | "body" | "short" {
  const segment = stripLocale(pathname).split("/")[1] ?? "";

  if (segment === "") return "home";
  if (BODY_ROUTES.has(segment)) return "body";
  // /terms, /privacy and the 404 all render WaveShort, a 400px gradient.
  return "short";
}

export default function Layout() {
  const { pathname } = useLocation();
  const { m } = useTranslation();
  // Below `md` the header gives way to the tab bar. Rendering one or the other,
  // rather than hiding one with CSS, keeps a single navigation landmark in the
  // document. The same width switches the spacing variables in globals.css.
  const tabs = useMediaQuery("(width < 650px)");

  // React Router 7 only ships <ScrollRestoration> in framework mode, so a SPA
  // navigation otherwise keeps the previous scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div data-page={pageKind(pathname)} className="page-canvas relative">
      <a
        href="#main"
        className="sr-only rounded-lg bg-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100]"
      >
        {m.a11y.skipToContent}
      </a>
      {!tabs && <Header />}
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {tabs && <TabBar />}
    </div>
  );
}
