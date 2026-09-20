import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import InfoBox from "../text/infoBox";
import { Project } from "../../data/model/project";
import ProjectCard from "../cards/ProjectCard";
import { useStaggeredReveal } from "../../hooks/useStaggeredReveal";
import LoadingSpinner from "../common/LoadingSpinner";
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

  // Declared before the early returns below, as hooks must be. Until the
  // data arrives the ref is empty and the effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(projects?.length ?? 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load projects" />;

  return (
    <div className="h-auto">
      <WaveBody />
      <div className="relative mx-auto grid max-w-[1234px] grid-cols-[360px_auto] px-[30px] pt-[150px] pb-[30px] max-xl:grid-cols-1 max-xl:justify-items-center max-xl:text-center max-md:grid-cols-1 max-md:justify-items-center max-md:px-[30px] max-md:pt-[120px] max-md:pb-0">
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={false}
        />
      </div>
      <div
        ref={gridRef}
        className="relative mx-auto grid min-h-[1000px] max-w-[1234px] grid-cols-4 gap-10 px-[30px] pt-5 pb-[120px] max-3xl:grid-cols-3 max-3xl:justify-items-center max-[990px]:grid-cols-2 max-[990px]:gap-[26px] max-md:grid-cols-1"
      >
        {projects?.map((projectEntry, index) => (
          <ProjectCard project={projectEntry} key={index} />
        ))}
      </div>
    </div>
  );
}
