import { useState } from "react";
import { News } from "../../data/model/news";

interface NewsCardCollapsedProps {
  news: News;
}

export default function NewsCardCollapsed({ news }: NewsCardCollapsedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener"
      className="group relative max-w-[500px] cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02]"
    >
      <div className="relative h-[90px] max-w-[500px] overflow-hidden rounded-[20px] max-[470px]:h-[80px]">
        <div className="h-full w-full">
          <img
            src={news.image}
            alt="News Image"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover ${loaded ? "block" : "hidden"}`}
          />
          <img
            src="/images/animations/loading.gif"
            alt="News Header Loading"
            className={`h-full w-full object-cover ${!loaded ? "block" : "hidden"}`}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        <p className="absolute bottom-2 left-4 right-4 text-[15px] font-semibold leading-[18px] text-white">
          {news.title_en}
        </p>
      </div>
    </a>
  );
}
