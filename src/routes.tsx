import { Outlet, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import PostsPage from "./pages/PostsPage";
import ProjectsPage from "./pages/ProjectsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import BlogPostPage from "./pages/BlogPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./components/admin/AdminLayout";
import LoginForm from "./components/admin/LoginForm";
import Dashboard from "./components/admin/Dashboard";
import CollectionEditor from "./components/admin/CollectionEditor";
import { SCHEMAS } from "./data/schema";
import LocaleRoute, { RedirectToLocale } from "./i18n/LocaleRoute";
import { LanguageProvider } from "./i18n/LanguageContext";

/**
 * Admin is deliberately not locale-prefixed: it is private and single-audience.
 * It still gets a provider so its chrome can be translated, driven by the
 * stored preference rather than the URL.
 */
function AdminLocaleBoundary() {
  return (
    <LanguageProvider>
      <Outlet />
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
          {Object.values(SCHEMAS).map((schema) => (
            <Route
              key={schema.key}
              path={schema.key}
              element={<CollectionEditor schema={schema} />}
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
