import { Routes, Route } from "react-router-dom";
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
import NewsEditor from "./components/admin/NewsEditor";
import PostEditor from "./components/admin/PostEditor";
import ProjectEditor from "./components/admin/ProjectEditor";
import WorkEditor from "./components/admin/WorkEditor";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/admin/login" element={<LoginForm />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="news" element={<NewsEditor />} />
          <Route path="posts" element={<PostEditor />} />
          <Route path="projects" element={<ProjectEditor />} />
          <Route path="work" element={<WorkEditor />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
