import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import PageTitle from "../text/PageTitle";
import { Project } from "../../data/model/project";
import ProjectCard from "../cards/ProjectCard";
import { useStaggeredReveal } from "../../hooks/useStaggeredReveal";
import SkeletonGrid from "../cards/SkeletonGrid";
import ErrorFallback from "../common/ErrorFallback";
import { useTranslation } from "../../i18n/LanguageContext";

export default function ProjectSection() {
  const { m } = useTranslation();
  const info = m.sections.projects;
  const {
    data: projects,
    loading,
    error,
  } = useFirestoreCollection<Project>("project", {
    orderBy: [["date", "desc"]],
  });

  // Until the data arrives the grid is not mounted, the ref is empty and the
  // effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(projects?.length ?? 0);

  // Shared by the placeholders and the real grid, so nothing moves when the
  // data arrives.
  const grid =
    "relative mx-auto grid min-h-[1000px] max-w-[1234px] grid-cols-4 gap-10 px-[30px] pt-5 pb-[120px] max-3xl:grid-cols-3 max-3xl:justify-items-center max-[990px]:grid-cols-2 max-[990px]:gap-[26px] max-md:grid-cols-1 max-md:px-5";

  return (
    <div className="h-auto">
      <WaveBody />
      <PageTitle title={info.title} description={info.description} />
      {loading ? (
        <SkeletonGrid variant="project" count={6} className={grid} />
      ) : error ? (
        <ErrorFallback message="Failed to load projects" />
      ) : (
        <div ref={gridRef} className={grid}>
          {projects?.map((projectEntry, index) => (
            <ProjectCard project={projectEntry} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
