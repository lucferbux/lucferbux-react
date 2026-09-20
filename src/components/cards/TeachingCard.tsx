import type { Teaching, TeachingLink } from "../../data/model/teaching";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";
import { iconUrl } from "../../utils/iconUrl";

interface TeachingCardProps {
  course: Teaching;
}

function LinkPill({ label, url }: TeachingLink) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white no-underline transition hover:bg-white/20"
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

  return (
    <article
      className="grid h-full animate-fadein content-start gap-4 rounded-[20px] p-6 max-md:p-5"
      style={{
        background: "rgba(66,66,66,0.3)",
        border: "0.5px solid rgba(255,255,255,0.2)",
        boxShadow: "0px 26px 50px rgba(0,0,0,0.25)",
        backdropFilter: "blur(45px)",
        WebkitBackdropFilter: "blur(45px)",
      }}
    >
      <div className="flex items-start gap-4">
        <img src={iconUrl(course.icon)} alt="" className="h-10 w-10 shrink-0" />
        <div className="min-w-0">
          <h3 className="text-[22px] leading-[1.2] font-bold break-words text-white max-xs:text-[18px]">
            {localizedField(course, "title", locale)}
          </h3>
          <p className="mt-1 text-[13px] font-semibold text-white/70 uppercase">
            {localizedField(course, "institution", locale)} · {course.period}
          </p>
        </div>
      </div>

      <p className="text-[16px] leading-[140%] whitespace-pre-line text-white/85 max-xs:text-[14px]">
        {localizedField(course, "description", locale)}
      </p>

      {course.tags && course.tags.length > 0 && (
        <ul className="flex list-none flex-wrap gap-2 p-0">
          {course.tags.map((tag) => (
            <li
              key={tag}
              className="rounded bg-white/10 px-2 py-0.5 text-[12px] text-white/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <LinkPill key={link.url} {...link} />
          ))}
        </div>
      )}
    </article>
  );
}
