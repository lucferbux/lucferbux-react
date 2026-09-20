import { useCallback } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { LanguageProvider, detectLocale } from "./LanguageContext";
import { isLocale, type Locale } from "./locales";

/**
 * Send an un-prefixed path to its localized equivalent, preserving the rest of
 * the URL. This is what keeps previously shared links such as
 * `lucferbux.dev/news` working: they land on `/en/news` (or `/es/news`).
 */
export function RedirectToLocale() {
  const { pathname, search, hash } = useLocation();
  const locale = detectLocale();
  const rest = pathname === "/" ? "" : pathname;
  return <Navigate to={`/${locale}${rest}${search}${hash}`} replace />;
}

/**
 * Validates the `:lang` segment and provides the locale to everything below.
 *
 * An unknown first segment (`/foo`) is treated as a path, not a locale, and is
 * redirected to `/{detected}/foo`, where the catch-all renders a 404. That is
 * terminal — the second pass has a valid locale, so it cannot loop.
 */
export default function LocaleRoute() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLocaleChange = useCallback(
    (next: Locale) => {
      const rest = location.pathname.replace(/^\/[^/]+/, "");
      navigate(`/${next}${rest}${location.search}${location.hash}`, {
        replace: true,
      });
    },
    [location, navigate]
  );

  if (!isLocale(lang)) return <RedirectToLocale />;

  return (
    <LanguageProvider locale={lang} onLocaleChange={handleLocaleChange}>
      <Outlet />
    </LanguageProvider>
  );
}
