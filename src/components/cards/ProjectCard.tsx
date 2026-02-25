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
      className="group w-[280px] cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] max-md:w-auto max-md:min-w-[240px] max-md:max-w-[450px] max-xs:w-auto max-xs:min-w-[240px]"
    >
      <div
        className="project-card-bg relative grid h-[320px] w-[280px] gap-3 rounded-[20px] p-5 text-left backdrop-blur-[40px] animate-[fadein_0.4s] transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:bg-[rgba(66,66,66,0.25)] hover:scale-[1.03] active:bg-[rgba(66,66,66,0.28)] active:scale-[1.01] max-md:h-[280px] max-md:w-auto max-md:min-w-[240px] max-md:max-w-[450px] max-xs:h-[280px] max-xs:w-auto max-xs:min-w-[240px]"
        style={{
          background: "rgba(66, 66, 66, 0.3)",
          boxShadow:
            "rgb(24 32 79 / 25%) 0px 40px 80px, rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset",
        }}
      >
        {project.version && (
          <div className="absolute right-5 top-5 rounded-[5px] bg-black/20 px-[6px] py-[2px]">
            <span className="text-[13px] font-semibold uppercase leading-[130%] text-black dark:text-white">
              {project.version}
            </span>
          </div>
        )}
        <p className="text-[13px] font-semibold uppercase leading-[130%] text-black dark:text-white">
          {captionText ?? ""}
        </p>
        <h3 className="break-words text-[30px] font-bold max-xs:text-[26px] text-black dark:text-white">
          {project.title_en}
        </h3>
        <p className="text-[17px] font-normal leading-[130%] text-black/70 max-xs:text-[14px] max-xs:leading-[100%] dark:text-white/70">
          {project.description_en}
        </p>
        <div className="grid grid-cols-[32px_auto] items-center gap-[10px]">
          <div className="grid h-8 w-8 items-center justify-items-center rounded-full bg-black/20">
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
