import { Work } from "../../data/model/work";
import { ExternalLink } from "../../data/model/externalLink";
import ResumeeHeader from "./ResumeeHeader";
import ResumeeCardRow from "./ResumeeCardRow";
import { useTranslation } from "../../i18n/LanguageContext";

interface ResumeeCardProps {
  works: Work[];
}

export default function ResumeeCard({ works }: ResumeeCardProps) {
  const { m } = useTranslation();
  // No reveal on the experience rows. They live inside their own scroll box,
  // so a staggered fade there read as the list still loading rather than as an
  // entrance — the card looked broken for the first half second.
  const headerInfo = {
    title: m.resumee.name,
    caption: m.resumee.caption,
    description: m.resumee.description,
    buttons: [
      { text: "GitHub", image: "github", link: "https://github.com/lucferbux" },
      {
        text: "LinkedIn",
        image: "linkedin",
        link: "https://www.linkedin.com/in/lucferbux/",
      },
    ] as ExternalLink[],
  };

  return (
    // No `overflow-hidden`. The orange tile inside zooms on hover, and this
    // was clipping it at the card's edge as it grew — which is what made the
    // zoom look like a snap rather than a movement. The tile sits inside 20px
    // of padding and grows about 5px a side, so nothing reaches the corners.
    <div className="glass-panel group animate-fadein mx-5 grid h-[400px] max-w-[786px] grid-cols-[240px_auto] gap-x-5 p-5 max-md:h-[800px] max-md:grid-cols-1 max-md:grid-rows-[min-content_1fr] max-md:justify-items-center max-md:gap-0">
      <div className="contents">
        <ResumeeHeader
          title={headerInfo.title}
          caption={headerInfo.caption}
          description={headerInfo.description}
          buttons={headerInfo.buttons}
        />
      </div>
      <div className="flex h-[350px] flex-col px-2.5 py-5 max-md:h-auto max-md:min-h-0 max-md:w-full">
        <div className="shrink-0 text-[13px] font-semibold uppercase leading-[130%] text-black/70 dark:text-white/70">
          {m.sections.resumee.experience}
        </div>
        <div
          className="mt-3 grid min-h-0 flex-1 gap-2 overflow-y-scroll [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
          style={{
            maskImage:
              "linear-gradient(rgb(255,255,255) 80%, rgba(255,255,255,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(rgb(255,255,255) 80%, rgba(255,255,255,0) 100%)",
          }}
        >
          {works.map((work, index) => (
            <ResumeeCardRow work={work} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
