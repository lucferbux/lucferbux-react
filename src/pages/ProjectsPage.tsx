import SEO from "../components/layout/SEO";
import { useTranslation } from "../i18n/LanguageContext";
import ProjectSection from "../components/projects/ProjectSection";

export default function ProjectsPage() {
  const { m } = useTranslation();

  return (
    <>
      <SEO
        title={m.pages.projects.title}
        description={m.pages.projects.description}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <ProjectSection />
    </>
  );
}
