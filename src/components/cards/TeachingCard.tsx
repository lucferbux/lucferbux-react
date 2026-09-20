import type { Teaching, TeachingLink } from "../../data/model/teaching";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";
import EntityIcon from "../common/EntityIcon";

interface TeachingCardProps {
  course: Teaching;
}

function LinkPill({ label, url }: TeachingLink) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="motion-glass rounded-full border border-black/15 bg-black/[0.07] px-3 py-1.5 text-[13px] font-medium !text-black no-underline hover:bg-black/15 dark:border-white/25 dark:bg-white/10 dark:!text-white dark:hover:bg-white/20"
    >
      {label}
    </a>
  );
}

export default function TeachingCard({ course }: TeachingCardProps) {
  const { locale, m } = useTranslation();

  const links: TeachingLink[] = [
    ...(course.siteUrl
      ? [{ label: m.teaching.courseSite, url: course.siteUrl }]
      : []),
    ...(course.repoUrl ? [{ label: "GitHub", url: course.repoUrl }] : []),
    ...(course.links ?? []),
  ];

  // The card's own destination: the course site if there is one, else the
  // repository. Without it the card had no cursor and no primary action, which
  // is what made it feel unlike the project and post cards.
  const primary = course.siteUrl ?? course.repoUrl;

  return (
    // flex column rather than grid, so the link pills can be pushed to the
    // bottom with `mt-auto` and every card in a row lines its actions up.
    //
    // Same hover as ProjectCard and PostCard: a 1.02 scale on the whole card.
    // It used to lift 4px instead, which read as a different kind of object.
    <article
      className={`glass-panel motion-glass group relative flex h-full flex-col gap-4 p-6 max-md:p-5 ${
        primary ? "cursor-pointer hover:scale-[1.02] active:scale-[1.005]" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <EntityIcon
          icon={course.icon}
          size={40}
          className="motion-glass group-hover:scale-105"
        />
        <div className="min-w-0">
          <h3 className="text-[22px] leading-[1.2] font-bold break-words text-black max-xs:text-[18px] dark:text-white">
            {primary ? (
              <a
                href={primary}
                target="_blank"
                rel="noopener noreferrer"
                // Stretched link: the whole card is clickable without nesting
                // anchors inside the pills below.
                className="font-bold !text-black no-underline after:absolute after:inset-0 after:content-[''] dark:!text-white"
              >
                {localizedField(course, "title", locale)}
              </a>
            ) : (
              localizedField(course, "title", locale)
            )}
          </h3>
          <p className="mt-1 text-[13px] font-semibold text-black/60 uppercase dark:text-white/70">
            {localizedField(course, "institution", locale)} · {course.period}
          </p>
        </div>
      </div>

      <p className="text-[16px] leading-[140%] whitespace-pre-line text-black/80 max-xs:text-[14px] dark:text-white/85">
        {localizedField(course, "description", locale)}
      </p>

      {course.tags && course.tags.length > 0 && (
        <ul className="flex list-none flex-wrap gap-2 p-0">
          {course.tags.map((tag) => (
            <li
              key={tag}
              className="rounded bg-black/[0.07] px-2 py-0.5 text-[12px] text-black/60 dark:bg-white/10 dark:text-white/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {links.length > 0 && (
        <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-1">
          {links.map((link) => (
            <LinkPill key={link.url} {...link} />
          ))}
        </div>
      )}
    </article>
  );
}
