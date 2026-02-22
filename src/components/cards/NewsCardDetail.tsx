import { News } from "../../data/model/news";
import NewsCard from "./NewsCard";
import NewsCardCollapsed from "./NewsCardCollapsed";

interface NewsCardDetailProps {
  news: News;
  inverted: boolean;
}

export default function NewsCardDetail({ news, inverted }: NewsCardDetailProps) {
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener"
      className="group cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02]"
    >
      <div
        className="relative z-20 grid h-[400px] min-w-[426px] max-w-[586px] animate-[fadein_0.4s] grid-cols-[auto_auto] gap-x-5 rounded-[20px] border-[0.5px] border-white/20 p-5 backdrop-blur-[45px] max-md:h-[520px] max-md:min-w-[100px] max-md:max-w-[1000px] max-md:grid-cols-1 max-md:grid-rows-[min-content_auto] max-md:justify-items-center max-md:gap-5"
        style={{
          direction: inverted ? "rtl" : "ltr",
          background: "rgba(66, 66, 66, 0.3)",
          boxShadow: "0px 26px 50px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Full NewsCard — visible on desktop, hidden on mobile */}
        <div className="contents max-md:hidden">
          <NewsCard news={news} />
        </div>
        {/* Collapsed version on mobile — matching old implementation */}
        <div className="hidden max-md:contents">
          <NewsCardCollapsed news={news} />
        </div>

        {/* Description only — no title, matches old implementation */}
        <div
          className="max-h-[360px] min-w-[180px] max-w-[287px] overflow-y-scroll whitespace-pre-line [&::-webkit-scrollbar]:hidden max-md:h-auto max-md:max-h-[3000px] max-md:min-w-[40px] max-md:max-w-[3000px] max-md:w-auto"
          style={{ direction: "ltr" }}
        >
          <p className="text-left text-[17px] font-normal leading-[130%] text-black mix-blend-normal dark:text-white/80">
            {news.description_en}
          </p>
        </div>
      </div>
    </a>
  );
}
