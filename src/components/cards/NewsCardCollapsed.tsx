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
      className="group relative h-fit cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-105 active:scale-[1.02]"
    >
      <div className="relative min-w-[200px] max-w-[500px]">
        <div className="w-full transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)]">
          <img
            src={news.image}
            alt="News Image"
            onLoad={() => setLoaded(true)}
            className={`m-0 w-full rounded-xl ${loaded ? "block" : "hidden"}`}
          />
          <img
            src="/images/animations/loading.gif"
            alt="News Header Loading"
            className={`m-0 w-full rounded-xl ${!loaded ? "block" : "hidden"}`}
          />
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-[rgba(208,208,208,1)] dark:to-[rgba(6,5,1,1)]" />
        <p className="absolute bottom-5 left-0 z-[3] mx-5 text-[20px] font-semibold leading-[16px] break-words text-black [direction:ltr] dark:text-white">
          {news.title_en}
        </p>
      </div>
    </a>
  );
}
