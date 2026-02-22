import { useState } from "react";
import { News } from "../../data/model/news";

interface NewsCardDetailProps {
  news: News;
  inverted: boolean;
}

export default function NewsCardDetail({ news, inverted }: NewsCardDetailProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener"
      className="group max-w-[500px] cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02]"
    >
      <div
        className="grid min-h-[360px] max-w-[500px] gap-2 rounded-[20px] p-2 max-md:grid-cols-1 max-md:min-h-[420px]"
        style={{
          gridTemplateColumns: inverted ? "1fr 180px" : "180px 1fr",
          direction: inverted ? "rtl" : "ltr",
          background: "rgba(255,255,255,0.6)",
          boxShadow: "0px 50px 100px rgba(34,79,169,0.3), inset 0 0 0 0.5px rgba(255,255,255,0.6)",
        }}
      >
        <div
          className="w-full overflow-hidden rounded-xl transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:scale-95"
          style={{ direction: "ltr" }}
        >
          <img
            src={news.image}
            alt="News Header Image"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full rounded-xl object-cover ${loaded ? "block" : "hidden"}`}
          />
          <img
            src="/images/animations/loading.gif"
            alt="News Header Loading"
            className={`h-full w-full rounded-xl object-cover ${!loaded ? "block" : "hidden"}`}
          />
        </div>
        <div className="grid gap-2.5 p-2.5" style={{ direction: "ltr" }}>
          <p className="text-[24px] font-semibold leading-[26px] break-words text-black max-[470px]:text-[18px] max-[470px]:leading-[22px] dark:text-white">
            {news.title_en}
          </p>
          <p className="text-[17px] font-normal leading-[130%] text-black/70 max-xs:text-[15px] dark:text-white/70">
            {news.description_en}
          </p>
          <p className="mt-auto text-[15px] font-normal leading-[40px] text-black/70 dark:text-white/70">
            {new Date(
              news.timestamp instanceof Date
                ? news.timestamp.getTime()
                : (news.timestamp as any).seconds
                  ? (news.timestamp as any).seconds * 1000
                  : (news.timestamp as any)
            ).toLocaleDateString([], {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </a>
  );
}
