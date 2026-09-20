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
      {/* Was a 360px box with a `2fr` middle row, so the title floated in the
          centre of a cavern of empty gradient — these cards carry a title and
          a date and nothing else, and the fixed height had no relation to
          that. No height of its own now: `h-full` makes every card in a row
          match the tallest one's content, so they stay even without anybody
          choosing a number. */}
      <div className="news-card-surface relative flex h-full min-w-[200px] max-w-[260px] flex-col gap-3 rounded-[20px] p-2.5 text-center">
        <div className="motion-glass m-0 w-full group-hover:scale-[0.97]">
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
        <p className="px-1 text-[21px] leading-[1.2] font-semibold break-words text-black max-[470px]:text-[18px] dark:text-white">
          {localizedField(news, "title", locale)}
        </p>
        {/* `dir="ltr"` is belt and braces now that the parent no longer sets
            RTL: a date mixes digits and letters, so it is the first thing the
            bidi algorithm reorders if anyone reintroduces it. */}
        <p
          dir="ltr"
          className="mt-auto pb-1 text-center text-[14px] leading-[1.4] font-normal text-black/70 dark:text-white/70"
        >
          {formatDate(news.timestamp as DateLike, locale)}
        </p>
      </div>
    </a>
  );
}
