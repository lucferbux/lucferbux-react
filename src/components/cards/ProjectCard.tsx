import clsx from "clsx";
import { Project } from "../../data/model/project";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";
import { toDate, type DateLike } from "../../i18n/formatDate";
import { toTagArray } from "../../utils/tags";
import ProjectCover from "../projects/ProjectCover";

interface ProjectCardProps {
  project: Project;
  captionText?: string;
  /**
   * `compact` is the landing page's card: a fixed box, because it sits in a
   * fixed-height section that clips whatever outgrows it (AGENTS.md, landmine
   * 3). `grid` fills its column and is as tall as its row.
   */
  variant?: "grid" | "compact";
}

const chip =
  "rounded-full px-2 py-0.5 text-[11px] leading-[1.45] font-semibold tracking-wide";

export default function ProjectCard({
  project,
  captionText,
  variant = "grid",
}: ProjectCardProps) {
  const { locale } = useTranslation();
  const compact = variant === "compact";

  const links = project.links ?? [];
  const tags = toTagArray(project.tags);
  const shownTags = tags.slice(0, compact ? 2 : 3);
  const hiddenTags = tags.slice(shownTags.length);
  const year = toDate(project.date as DateLike)?.getFullYear();
  const title = localizedField(project, "title", locale);

  return (
    // A div rather than an anchor: some projects carry extra links, and an
    // anchor cannot contain anchors. The title uses a stretched link so the
    // whole card is still one click target.
    <div
      className={clsx(
        "group relative h-full",
        compact && "w-[280px] max-md:w-full max-md:max-w-[450px]"
      )}
    >
      <div
        className={clsx(
          "glass-panel motion-glass relative flex h-full animate-[fadein_0.4s] flex-col overflow-hidden text-left",
          project.link && "group-hover:scale-[1.02] group-active:scale-[1.005]",
          compact && "h-[433px] max-md:h-[380px]"
        )}
      >
        <ProjectCover
          title={localizedField(project, "title", "en")}
          tags={tags}
          image={project.image}
          className={clsx(
            "w-full shrink-0",
            compact
              ? "aspect-video max-md:aspect-auto max-md:h-[150px]"
              : "aspect-video max-md:aspect-[2/1]"
          )}
        >
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            {captionText ? (
              <span className={clsx(chip, "bg-white/85 text-black uppercase")}>
                {captionText}
              </span>
            ) : (
              <span />
            )}
            {project.version && (
              <span className={clsx(chip, "bg-black/40 text-white")}>
                {project.version}
              </span>
            )}
          </div>
        </ProjectCover>

        <div className="flex min-h-0 flex-1 flex-col gap-2 p-5 max-md:p-4">
          <div className="flex h-4 items-center justify-between text-black/55 dark:text-white/60">
            <p className="text-[12px] leading-none font-semibold tracking-wide uppercase">
              {year}
            </p>
            {/* Only linked cards go anywhere, so only they get the arrow. */}
            {project.link && (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="motion-glass h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-dark dark:group-hover:text-primary-light"
              >
                <path d="M4.5 11.5l7-7M6 4.5h5.5V10" />
              </svg>
            )}
          </div>
          <h3 className="line-clamp-2 text-[22px] leading-[1.2] font-bold text-black dark:text-white">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener"
                className="font-bold !text-black no-underline after:absolute after:inset-0 after:content-[''] dark:!text-white"
              >
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          <p
            className={clsx(
              "text-[15px] leading-[1.45] font-normal text-black/70 dark:text-white/75",
              "line-clamp-4",
              compact && "max-md:line-clamp-3"
            )}
          >
            {localizedField(project, "description", locale)}
          </p>

          <div className="mt-auto grid gap-3 pt-2">
            {links.length > 0 && (
              <div className="relative z-10 flex flex-wrap gap-1.5">
                {links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="motion-glass rounded-full bg-black/15 px-2.5 py-1 text-[12px] font-semibold !text-black no-underline hover:bg-black/30 dark:bg-white/15 dark:!text-white dark:hover:bg-white/30"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {tags.length > 0 && (
              <ul className="flex h-[23px] list-none flex-wrap gap-1.5 overflow-hidden p-0">
                {shownTags.map((tag) => (
                  <li
                    key={tag}
                    className={clsx(
                      chip,
                      "bg-black/[0.07] text-black/65 dark:bg-white/10 dark:text-white/75"
                    )}
                  >
                    {tag}
                  </li>
                ))}
                {hiddenTags.length > 0 && (
                  <li
                    title={hiddenTags.join(", ")}
                    className={clsx(chip, "text-black/50 dark:text-white/55")}
                  >
                    +{hiddenTags.length}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
