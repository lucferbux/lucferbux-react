import SEO from "../components/layout/SEO";
import ProjectSection from "../components/projects/ProjectSection";

export default function ProjectsPage() {
  return (
    <>
      <SEO title="Projects" themeColor="#007789" themeColorDark="#2b2830" />
      <ProjectSection />
    </>
  );
}
