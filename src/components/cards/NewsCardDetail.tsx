import { News } from "../../data/model/news";
import NewsCard from "./NewsCard";
import NewsCardCollapsed from "./NewsCardCollapsed";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";

interface NewsCardDetailProps {
  news: News;
  inverted: boolean;
}

export default function NewsCardDetail({
  news,
  inverted,
}: NewsCardDetailProps) {
  const { locale } = useTranslation();
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener"
      className="group cursor-pointer motion-glass hover:scale-[1.02] active:scale-[1.005]"
    >
      {/* The two columns are swapped with grid `order`, not `direction: rtl`.
          RTL is a *text* property: it made the bidi algorithm reorder the
          date, so "15 de agosto de 2026" rendered as "de agosto de 2026 15".
          The old guard against that was `ltr:direction-ltr`, which is not a
          Tailwind utility and compiled to nothing. */}
      <div className="glass-panel relative z-20 grid h-[400px] min-w-[426px] max-w-[586px] animate-[fadein_0.4s] grid-cols-[auto_auto] gap-x-5 p-5 max-md:h-auto max-md:min-w-[100px] max-md:max-w-[1000px] max-md:grid-cols-1 max-md:grid-rows-[min-content_auto] max-md:justify-items-center max-md:gap-5">
        {/* Full NewsCard — visible on desktop, hidden on mobile */}
        <div
          className={`contents max-md:hidden ${inverted ? "*:order-2" : ""}`}
        >
          <NewsCard news={news} interactive={false} />
        </div>
        {/* Collapsed version on mobile — matching old implementation */}
        <div className="hidden max-md:contents">
          <NewsCardCollapsed news={news} />
        </div>

        {/* Description only — no title, matches old implementation.
            `relative` so the scroll affordance below can be positioned. */}
        <div
          className={`relative min-w-[180px] max-w-[287px] max-md:h-auto max-md:w-auto max-md:min-w-[40px] max-md:max-w-[3000px] ${
            inverted ? "order-1" : ""
          }`}
        >
          {/* The text is longer than the box on every entry, and with the
              scrollbar hidden it simply stopped mid-word. Now the scrollbar is
              visible and the last line fades out, so there are two signals
              that the text continues.

              Mobile scrolls too. It used to flow freely, which sounds kinder
              but is not: the section around it is a fixed 1200px box with
              `overflow-hidden`, so at 390px the content came to 1750px and 550
              of them were simply cut off — including the end of every article.
              Bounded and scrollable, nothing is lost. */}
          <div className="scroll-subtle scroll-mask max-h-[360px] overflow-y-auto pr-2 whitespace-pre-line max-md:max-h-[170px]">
            <p className="text-left text-[17px] leading-[140%] font-normal text-black max-xs:text-[14px] dark:text-white/80">
              {localizedField(news, "description", locale)}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
