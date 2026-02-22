import { Work } from "../../data/model/work";
import { ExternalLink } from "../../data/model/externalLink";
import ResumeeHeader from "./ResumeeHeader";
import ResumeeCardRow from "./ResumeeCardRow";

const headerInfo = {
  title: "Lucas Fernández",
  caption: "Software Developer",
  description: "Full-stack developer passionate about technology and innovation",
  buttons: [
    { text: "GitHub", image: "github", link: "https://github.com/lucferbux" },
    { text: "LinkedIn", image: "linkedin", link: "https://www.linkedin.com/in/lucferbux/" },
  ] as ExternalLink[],
};

interface ResumeeCardProps {
  works: Work[];
}

export default function ResumeeCard({ works }: ResumeeCardProps) {
  return (
    <div
      className="mx-5 grid max-w-[786px] animate-fadein grid-cols-[240px_auto] gap-x-5 rounded-[20px] p-5 max-md:h-[800px] max-md:grid-cols-1 max-md:grid-rows-[min-content_auto] max-md:justify-items-center max-md:gap-0"
      style={{
        background: "rgba(66,66,66,0.3)",
        border: "0.5px solid rgba(255,255,255,0.2)",
        boxShadow: "0px 26.0498px 50.1px rgba(0,0,0,0.25)",
        backdropFilter: "blur(45px)",
      }}
    >
      <div className="contents">
        <ResumeeHeader
          title={headerInfo.title}
          caption={headerInfo.caption}
          description={headerInfo.description}
          buttons={headerInfo.buttons}
        />
      </div>
      <div className="h-[350px] px-2.5 py-5 max-md:h-[480px] max-md:w-auto">
        <div className="text-[13px] font-semibold uppercase leading-[130%] text-black/70 dark:text-white/70">
          Experience
        </div>
        <div
          className="mt-3 grid h-full gap-2 overflow-y-scroll [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
          style={{
            maskImage: "linear-gradient(rgb(255,255,255) 80%, rgba(255,255,255,0) 100%)",
            WebkitMaskImage: "linear-gradient(rgb(255,255,255) 80%, rgba(255,255,255,0) 100%)",
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
