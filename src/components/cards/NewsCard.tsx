import { useState } from "react";
import { News } from "../../data/model/news";

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener"
      className="group max-w-[260px] cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:scale-110 active:scale-105"
    >
      <div
        className="relative grid min-w-[200px] max-w-[260px] grid-cols-1 grid-rows-[auto_2fr_auto] items-center gap-[30px] rounded-[20px] p-2 text-center max-[414px]:h-[330px]"
        style={{
          height: 360,
          background: 'linear-gradient(200.42deg, #EABE7D 13.57%, #C98C31 98.35%)',
          boxShadow: 'rgb(78 153 227 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px',
        }}
      >
        <div className="news-card-gradient m-0 w-full transition-all duration-800 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-hover:scale-95">
          <img
            src={news.image}
            alt="News Header Image"
            onLoad={() => setLoaded(true)}
            className={`m-0 w-full rounded-xl ${loaded ? 'block' : 'hidden'}`}
          />
          <img
            src="/images/animations/loading.gif"
            alt="News Header Loading"
            className={`m-0 w-full rounded-xl ${!loaded ? 'block' : 'hidden'}`}
          />
        </div>
        <p className="text-[24px] font-semibold leading-[26px] break-words text-black max-[470px]:text-[18px] max-[470px]:leading-[22px] dark:text-white">
          {news.title_en}
        </p>
        <p className="mt-2.5 text-center text-[15px] font-normal leading-[40px] text-black/70 ltr:direction-ltr dark:text-white/70">
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
    </a>
  );
}
