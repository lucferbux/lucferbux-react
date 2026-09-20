import { useState } from "react";
import { News } from "../../data/model/news";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";
import { formatDate, type DateLike } from "../../i18n/formatDate";

interface NewsCardProps {
  news: News;
  /**
   * Whether this card responds to hover on its own.
   *
   * False when it sits inside `NewsCardDetail`, which already scales: the two
   * used to compose to 1.155x and the card jumped. On the home page row these
   * cards are the only thing there is to hover, so they keep their own lift —
   * just a lot less of it than the 1.10 it used to be.
   */
  interactive?: boolean;
}

export default function NewsCard({ news, interactive = true }: NewsCardProps) {
  const { locale } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener"
      className={`group max-w-[260px] cursor-pointer ${
        interactive ? "motion-glass hover:scale-[1.04] active:scale-[1.01]" : ""
      }`}
    >
      <div
        className="relative grid h-[360px] min-w-[200px] max-w-[260px] grid-cols-1 grid-rows-[auto_2fr_auto] items-center gap-[30px] rounded-[20px] p-2 text-center max-[414px]:h-[330px]"
        style={{
          background:
            "linear-gradient(200.42deg, #EABE7D 13.57%, #C98C31 98.35%)",
          boxShadow:
            "rgb(78 153 227 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px",
        }}
      >
        <div className="news-card-gradient motion-glass m-0 w-full group-hover:scale-[0.97]">
          <img
            src={news.image}
            alt=""
            onLoad={() => setLoaded(true)}
            className={`m-0 w-full rounded-xl ${loaded ? "block" : "hidden"}`}
          />
          <img
            src="/images/animations/loading.gif"
            alt="News Header Loading"
            className={`m-0 w-full rounded-xl ${!loaded ? "block" : "hidden"}`}
          />
        </div>
        <p className="text-[24px] font-semibold leading-[26px] break-words text-black max-[470px]:text-[18px] max-[470px]:leading-[22px] dark:text-white">
          {localizedField(news, "title", locale)}
        </p>
        {/* `dir="ltr"` is belt and braces now that the parent no longer sets
            RTL: a date mixes digits and letters, so it is the first thing the
            bidi algorithm reorders if anyone reintroduces it. */}
        <p
          dir="ltr"
          className="mt-2.5 text-center text-[15px] leading-[1.4] font-normal text-black/70 dark:text-white/70"
        >
          {formatDate(news.timestamp as DateLike, locale)}
        </p>
      </div>
    </a>
  );
}
