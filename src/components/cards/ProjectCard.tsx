import { Project } from "../../data/model/project";

interface ProjectCardProps {
  project: Project;
  captionText?: string;
}

export default function ProjectCard({ project, captionText }: ProjectCardProps) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener"
      className="group cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02]"
    >
      <div
        className="project-card-bg relative grid w-[280px] gap-4 rounded-[20px] p-5 max-xs:w-[260px]"
        style={{
          background: "rgba(255,255,255,0.6)",
          boxShadow:
            "0px 50px 100px rgba(34,79,169,0.3), inset 0 0 0 0.5px rgba(255,255,255,0.6)",
        }}
      >
        {project.version && (
          <div className="absolute right-5 top-5 rounded-[5px] bg-black/20 px-[6px] py-[2px]">
            <span className="text-[13px] font-semibold uppercase leading-[130%] text-black dark:text-white">
              {project.version}
            </span>
          </div>
        )}
        <p className="text-[13px] font-semibold uppercase leading-[130%] text-black/50 dark:text-white/50">
          {captionText ?? ""}
        </p>
        <h3 className="break-words text-[30px] font-bold max-xs:text-[26px] text-black dark:text-white">
          {project.title_en}
        </h3>
        <p className="text-[17px] font-normal leading-[130%] text-black/70 max-xs:text-[14px] dark:text-white/70">
          {project.description_en}
        </p>
        <div className="grid grid-cols-[32px_auto] items-center gap-[10px]">
          <div className="grid items-center justify-items-center rounded-full bg-white/30 p-1">
            <img
              src="/images/icons/code.svg"
              alt="Icon Tag Project"
              className="h-5 w-5"
            />
          </div>
          <p className="text-[13px] font-normal leading-[130%] text-black/70 dark:text-white/70">
            {project.tags}
          </p>
        </div>
      </div>
    </a>
  );
}
