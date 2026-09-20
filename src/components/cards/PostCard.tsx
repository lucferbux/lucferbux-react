import { useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "../../data/model/post";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";
import { useLocalePath } from "../../i18n/useLocalePath";
import { formatDate, type DateLike } from "../../i18n/formatDate";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { locale } = useTranslation();
  const localePath = useLocalePath();
  const [loaded, setLoaded] = useState(false);

  const date = formatDate(post.date as DateLike, locale);

  const cardContent = (
    // The card used to be sized by the banner's own 1200x630 aspect, with the
    // title and description absolutely positioned against its top and bottom
    // edges. That left a large dead band through the middle of every card. Now
    // the banner is a background layer and the text is in normal flow, so the
    // card is exactly as tall as its content.
    <div className="group glass-panel relative flex h-full min-h-[200px] min-w-[200px] max-w-[500px] animate-[fadein_0.4s] flex-col gap-4 overflow-hidden p-6 text-black max-[520px]:p-5 dark:text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src={post.image}
          alt=""
          onLoad={() => setLoaded(true)}
          // The banner has its title rasterised into the SVG, in English. At
          // blur(4px) it stayed legible under the card's own localised title,
          // so every post read as two overlapping headlines. Blurred harder it
          // becomes texture, which is all it was ever meant to be. `scale-110`
          // hides the soft edge the blur leaves at the boundary.
          className={`h-full w-full scale-110 object-cover blur-[14px] ${loaded ? "block" : "hidden"}`}
        />
        <img
          src="/images/animations/loading.gif"
          alt=""
          className={`h-full w-full object-cover ${!loaded ? "block" : "hidden"}`}
        />
        {/* Scrim over the banner. This layer sits at `-z-10`, so the card's
            own glass tint is painted on top of it as well — at 72% the two
            together left the banner about 12% visible and it disappeared
            entirely once the glass was frosted. Measured against the same card
            with the banner hidden, dropping this to 40% roughly doubles how
            much of it comes through, and the tint above still carries the text
            contrast. */}
        <div className="absolute inset-0 bg-[rgb(226_232_240/40%)] dark:bg-black/45" />
      </div>

      <h3 className="text-[30px] leading-[1.15] font-bold break-words max-[520px]:text-[22px] max-[350px]:text-[18px]">
        {localizedField(post, "title", locale)}
      </h3>

      <p className="text-[17px] leading-[140%] font-medium break-words text-black/75 max-[520px]:text-[14px] dark:text-white/80">
        {localizedField(post, "description", locale)}
      </p>

      {date && (
        <p
          dir="ltr"
          className="mt-auto text-[13px] font-semibold text-black/55 uppercase dark:text-white/60"
        >
          {date}
        </p>
      )}
    </div>
  );

  if (post.internalLink) {
    return (
      <Link
        to={localePath(`/blog/${post.internalLink}`)}
        className="motion-glass relative block h-full cursor-pointer hover:scale-[1.02] active:scale-[1.005]"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener"
      className="motion-glass relative block h-full cursor-pointer hover:scale-[1.02] active:scale-[1.005]"
    >
      {cardContent}
    </a>
  );
}
