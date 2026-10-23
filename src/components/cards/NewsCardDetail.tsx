import clsx from "clsx";
import { News } from "../../data/model/news";
import NewsCard from "./NewsCard";
import NewsCardCollapsed from "./NewsCardCollapsed";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";
import { safeHref } from "../../utils/safeHref";

interface NewsCardDetailProps {
  news: News;
  inverted: boolean;
  /** On the news page: take the whole column once the grid is one card wide. */
  fill?: boolean;
}

export default function NewsCardDetail({
  news,
  inverted,
  fill,
}: NewsCardDetailProps) {
  const { locale, m } = useTranslation();
  return (
    <a
      href={safeHref(news.url)}
      target="_blank"
      rel="noopener"
      className="group cursor-pointer motion-glass hover:scale-[1.02] active:scale-[1.005]"
    >
      {/* The two columns are swapped with grid `order`, not `direction: rtl`.
          RTL is a *text* property: it made the bidi algorithm reorder the
          date, so "15 de agosto de 2026" rendered as "de agosto de 2026 15".
          The old guard against that was `ltr:direction-ltr`, which is not a
          Tailwind utility and compiled to nothing. */}
      <div
        className={clsx(
          "glass-panel relative z-20 grid h-[400px] max-w-[586px] min-w-[426px] animate-[fadein_0.4s] grid-cols-[auto_auto] gap-x-5 p-5 max-md:h-auto max-md:max-w-[1000px] max-md:min-w-[100px] max-md:grid-cols-1 max-md:grid-rows-[min-content_auto] max-md:justify-items-center max-md:gap-5",
          // One column of cards: the panel takes the full width and the text
          // column, wherever it sits, takes what the card leaves.
          fill && "max-[1020px]:max-w-none",
          fill &&
            (inverted
              ? "max-[1020px]:grid-cols-[1fr_auto]"
              : "max-[1020px]:grid-cols-[auto_1fr]")
        )}
      >
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
          className={clsx(
            "relative max-w-[287px] min-w-[180px] max-md:h-auto max-md:w-auto max-md:max-w-[3000px] max-md:min-w-[40px]",
            fill && "max-[1020px]:max-w-none",
            inverted && "order-1"
          )}
        >
          {/* The text is longer than the box on every entry, and with the
              scrollbar hidden it simply stopped mid-word. Now the scrollbar is
              visible and the last line fades out, so there are two signals
              that the text continues.

              On a phone the box is not scrollable: a scroll area inside a
              scrolling page traps the thumb, and the fade cut the text
              mid-sentence with nothing to say why. Six lines and a "read more"
              instead — the whole card is already the link. The height stays
              bounded either way, which the landing needs: its section is a
              fixed box with `overflow-hidden` and clips whatever outgrows it. */}
          <div className="scroll-subtle scroll-mask max-h-[360px] overflow-y-auto pr-2 whitespace-pre-line max-md:max-h-none max-md:overflow-visible max-md:pr-0 max-md:[mask-image:none] max-md:[-webkit-mask-image:none]">
            <p className="text-left text-[17px] leading-[140%] font-normal text-black max-md:line-clamp-6 max-xs:text-[14px] dark:text-white/80">
              {localizedField(news, "description", locale)}
            </p>
          </div>
          <p className="mt-2 hidden text-left text-[14px] leading-none font-semibold text-primary-dark max-md:block dark:text-primary-light">
            {m.sections.news.readMore} <span aria-hidden="true">&#8599;</span>
          </p>
        </div>
      </div>
    </a>
  );
}
