import { Project } from "../../data/model/project";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";

interface ProjectCardProps {
  project: Project;
  captionText?: string;
}

/** `tags` is an array in the seed but a comma-separated string in legacy docs. */
function tagList(tags: Project["tags"]): string {
  if (Array.isArray(tags)) return tags.join(" · ");
  return typeof tags === "string" ? tags : "";
}

export default function ProjectCard({
  project,
  captionText,
}: ProjectCardProps) {
  const { locale } = useTranslation();
  const links = project.links ?? [];

  return (
    // A div rather than an anchor: some projects carry extra links, and an
    // anchor cannot contain anchors. The title uses a stretched link so the
    // whole card stays clickable.
    <div className="group relative w-[280px] transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] max-md:w-auto max-md:max-w-[450px] max-md:min-w-[240px] max-xs:w-auto max-xs:min-w-[240px]">
      <div
        className="project-card-bg relative grid min-h-[320px] w-[280px] animate-[fadein_0.4s] gap-3 rounded-[20px] p-5 text-left backdrop-blur-[40px] transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:scale-[1.03] group-hover:bg-[rgba(66,66,66,0.25)] group-active:scale-[1.01] group-active:bg-[rgba(66,66,66,0.28)] max-md:min-h-[280px] max-md:w-auto max-md:max-w-[450px] max-md:min-w-[240px] max-xs:min-h-[280px] max-xs:w-auto max-xs:min-w-[240px]"
        style={{
          background: "rgba(66, 66, 66, 0.3)",
          boxShadow:
            "rgb(24 32 79 / 25%) 0px 40px 80px, rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset",
        }}
      >
        {project.version && (
          <div className="absolute top-5 right-5 rounded-[5px] bg-black/20 px-[6px] py-[2px]">
            <span className="text-[13px] leading-[130%] font-semibold text-black uppercase dark:text-white">
              {project.version}
            </span>
          </div>
        )}
        <p className="text-[13px] leading-[130%] font-semibold text-black uppercase dark:text-white">
          {captionText ?? ""}
        </p>
        <h3 className="text-[30px] font-bold break-words text-black max-xs:text-[26px] dark:text-white">
          <a
            href={project.link}
            target="_blank"
            rel="noopener"
            // Stretched link: covers the whole card without nesting anchors.
            className="font-bold !text-black no-underline after:absolute after:inset-0 after:content-[''] dark:!text-white"
          >
            {localizedField(project, "title", locale)}
          </a>
        </h3>
        <p className="text-[17px] leading-[130%] font-normal text-black/70 max-xs:text-[14px] max-xs:leading-[100%] dark:text-white/70">
          {localizedField(project, "description", locale)}
        </p>

        {links.length > 0 && (
          // Above the stretched link so these stay individually clickable.
          <div className="relative z-10 flex flex-wrap gap-1.5">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black/15 px-2.5 py-1 text-[12px] font-semibold !text-black no-underline transition hover:bg-black/30 dark:bg-white/15 dark:!text-white dark:hover:bg-white/30"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="grid grid-cols-[32px_auto] items-center gap-[10px]">
          <div className="grid h-8 w-8 items-center justify-items-center rounded-full bg-black/20">
            <img src="/images/icons/code.svg" alt="" className="h-5 w-5" />
          </div>
          <p className="text-[13px] leading-[130%] font-normal text-black/70 dark:text-white/70">
            {tagList(project.tags)}
          </p>
        </div>
      </div>
    </div>
  );
}
