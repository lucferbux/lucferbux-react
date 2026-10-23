import { lazy, Suspense } from "react";
import { Outlet, Routes, Route } from "react-router";
import { Helmet } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import PostsPage from "./pages/PostsPage";
import ProjectsPage from "./pages/ProjectsPage";
import TeachingPage from "./pages/TeachingPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { COLLECTION_KEYS } from "./data/schema/keys";
import LocaleRoute, { RedirectToLocale } from "./i18n/LocaleRoute";
import { LanguageProvider, useTranslation } from "./i18n/LanguageContext";

/*
 * Code splitting. The listing pages stay in the main bundle so navigating
 * between them never shows a fallback. Split out:
 * - the admin, which brings Firebase Auth and Storage, the schemas and the
 *   post index — none of which a visitor needs;
 * - the article page, which brings every post body, react-markdown and Prism;
 * - the legal pages, which are long and rarely visited.
 * The admin routes themselves stay declared here, with static paths: see
 * `data/schema/keys.ts` for why they cannot be a lazily loaded `/admin/*` tree.
 */
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const LoginForm = lazy(() => import("./components/admin/LoginForm"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const AdminCollection = lazy(
  () => import("./components/admin/AdminCollection")
);
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

/** The public pages set `<html lang>` through `SEO`; the admin has no `SEO`. */
function AdminDocumentLang() {
  const { locale } = useTranslation();
  return <Helmet htmlAttributes={{ lang: locale }} />;
}

/**
 * Admin is deliberately not locale-prefixed: it is private and single-audience.
 * It still gets a provider so its chrome can be translated, driven by the
 * stored preference rather than the URL.
 */
function AdminLocaleBoundary() {
  return (
    <LanguageProvider>
      <AdminDocumentLang />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </LanguageProvider>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminLocaleBoundary />}>
        <Route path="/admin/login" element={<LoginForm />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          {COLLECTION_KEYS.map((key) => (
            <Route
              key={key}
              path={key}
              element={<AdminCollection schemaKey={key} />}
            />
          ))}
        </Route>
      </Route>

      {/* Public site, localized. */}
      <Route path="/:lang" element={<LocaleRoute />}>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="teaching" element={<TeachingPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* Anything without a locale prefix — including previously shared links
          such as /news — is redirected into the localized tree. */}
      <Route path="*" element={<RedirectToLocale />} />
    </Routes>
  );
}
