import { useState } from "react";
import { News } from "../../data/model/news";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";

interface NewsCardCollapsedProps {
  news: News;
}

export default function NewsCardCollapsed({ news }: NewsCardCollapsedProps) {
  const { locale } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener"
      // No hover scale: the surrounding NewsCardDetail already scales.
      className="group relative h-fit cursor-pointer"
    >
      <div className="relative min-w-[200px] max-w-[500px] overflow-hidden rounded-xl">
        {/* Capped height with object-cover. The banner is 1200x630, so left
            to its own aspect it grew with the card: at 550px wide it alone was
            taller than the room the fixed-height section had for the whole
            card, and the bottom got clipped. */}
        <div className="w-full">
          <img
            src={news.image}
            alt=""
            onLoad={() => setLoaded(true)}
            // Blurred for the same reason PostCard's is: the banner carries
            // its title rasterised into the SVG, in English, and this card
            // paints the localised title straight over it. Unblurred, the two
            // headlines collided and neither could be read.
            className={`m-0 max-h-[190px] w-full scale-110 rounded-xl object-cover blur-[10px] ${loaded ? "block" : "hidden"}`}
          />
          <img
            src="/images/animations/loading.gif"
            alt="News Header Loading"
            className={`m-0 max-h-[190px] w-full rounded-xl object-cover ${!loaded ? "block" : "hidden"}`}
          />
        </div>
        <div className="absolute inset-0 rounded-xl bg-[rgb(226_232_240/70%)] dark:bg-black/65" />
        {/* leading was 16px on 20px text, so a two-line title overlapped. */}
        <p className="absolute bottom-5 left-0 z-[3] mx-5 text-[20px] leading-[1.15] font-semibold break-words text-black dark:text-white">
          {localizedField(news, "title", locale)}
        </p>
      </div>
    </a>
  );
}
