import type { ReactNode } from "react";
import clsx from "clsx";
import FadeImage from "../common/FadeImage";
import { coverSpec, type CoverMotif } from "./coverSpec";

interface ProjectCoverProps {
  /** The English title: the seed, so both languages share a cover. */
  title: string;
  tags: string[];
  /** An uploaded screenshot. When present it replaces the generated art. */
  image?: string;
  className?: string;
  children?: ReactNode;
}

/** Abstract line drawings on a 48px grid — a kind of project, not a logo. */
const MOTIFS: Record<CoverMotif, ReactNode> = {
  web: (
    <>
      <rect x="5" y="8" width="38" height="32" rx="4" />
      <path d="M5 16.5h38M10 12.3h.1M14 12.3h.1M18 12.3h.1" />
      <path d="M20 24l-4.5 4.5L20 33M28 24l4.5 4.5L28 33M25.6 22.5l-3.2 12" />
    </>
  ),
  mobile: (
    <>
      <rect x="14" y="4" width="20" height="40" rx="5" />
      <path d="M21 8.5h6M20.5 39.5h7" />
      <rect x="18.5" y="14" width="11" height="8" rx="2" />
      <path d="M18.5 27h11M18.5 31.5h7" />
    </>
  ),
  data: (
    <>
      <circle cx="24" cy="24" r="4.5" />
      <circle cx="10" cy="11" r="3" />
      <circle cx="38" cy="12" r="3" />
      <circle cx="9" cy="36" r="3" />
      <circle cx="39" cy="37" r="3" />
      <path d="M12.2 13.1l8.5 7.8M35.7 14l-8.3 7M11.3 34l9.1-7M36.7 35.1l-9-8" />
    </>
  ),
  security: (
    <>
      <path d="M24 4.5l15 5.5v11.5c0 9.6-6.3 17.2-15 21.5-8.7-4.3-15-11.9-15-21.5V10l15-5.5z" />
      <path d="M17.5 23.5l4.7 4.7 8.8-9.2" />
    </>
  ),
  cloud: (
    <>
      <path d="M24 4.5l16 9.2v18.6L24 41.5 8 32.3V13.7l16-9.2z" />
      <path d="M24 23v18.5M24 23l16-9.3M24 23L8 13.7" />
    </>
  ),
  docs: (
    <>
      <path d="M6 10c5.5-2 12-2 18 1.5 6-3.5 12.5-3.5 18-1.5v27c-5.5-2-12-2-18 1.5-6-3.5-12.5-3.5-18-1.5V10z" />
      <path d="M24 11.5v27M11 17.5c3-.6 5.8-.4 8.5.6M11 23.5c3-.6 5.8-.4 8.5.6M28.5 18.1c2.7-1 5.5-1.2 8.5-.6" />
    </>
  ),
  generic: (
    <>
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="24" r="13" />
      <path d="M24 3v6M24 39v6M3 24h6M39 24h6" />
    </>
  ),
};

/**
 * The picture at the top of a project card.
 *
 * Projects are created in the admin and carry no image by default, so the
 * cover is drawn here from the project's own data: a gradient and three soft
 * lights from the site palette, and a line drawing for its main technology.
 * It is plain CSS and one inline SVG — nothing to download, so nothing to
 * wait for.
 */
export default function ProjectCover({
  title,
  tags,
  image,
  className,
  children,
}: ProjectCoverProps) {
  if (image) {
    return (
      <div className={clsx("relative overflow-hidden", className)}>
        <FadeImage
          src={image}
          wrapperClassName="absolute inset-0"
          className="h-full w-full object-cover"
        />
        {children}
      </div>
    );
  }

  const { motif, from, via, accent, angle, glows } = coverSpec(title, tags);
  const backgroundImage = [
    ...glows.map(
      ({ x, y, color }) =>
        `radial-gradient(circle at ${x}% ${y}%, ${color}cc 0%, transparent 55%)`
    ),
    `linear-gradient(${angle}deg, ${from} 0%, ${via} 55%, ${accent} 100%)`,
  ].join(", ");

  return (
    <div
      className={clsx("relative overflow-hidden", className)}
      style={{ backgroundImage }}
    >
      {/* Calms the palette so white chips and the drawing read on every
          combination, and takes it down a step further in dark mode. */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/35" />
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="motion-glass absolute -right-[4%] -bottom-[14%] h-[92%] -rotate-[10deg] text-white/75 group-hover:scale-105"
      >
        {MOTIFS[motif]}
      </svg>
      {children}
    </div>
  );
}
