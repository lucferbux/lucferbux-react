import { Link } from "react-router-dom";
import SEO from "../components/layout/SEO";
import WaveShort from "../components/backgrounds/WaveShort";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";

/**
 * A real 404 page. This used to be `<Navigate to="/" replace />`, so an unknown
 * URL silently became the home page — indistinguishable, to a visitor or a
 * crawler, from the link having worked.
 */
export default function NotFoundPage() {
  const { m } = useTranslation();
  const localePath = useLocalePath();

  return (
    <>
      <SEO
        title={m.notFound.title}
        description={m.notFound.description}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <div className="overflow-hidden 4xl:pb-[100px]">
        <WaveShort />
        <div className="mx-auto grid max-w-[1234px] gap-[30px] px-[30px] pt-[180px] pb-[120px] max-lg:px-5">
          <p className="text-[80px] leading-none font-bold text-black/20 dark:text-white/20">
            404
          </p>
          <h1 className="text-[50px] font-bold text-black max-xs:text-[40px] dark:text-white">
            {m.notFound.title}
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[130%] text-black/70 dark:text-white/70">
            {m.notFound.description}
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              to={localePath("/")}
              className="rounded-lg bg-primary px-5 py-3 font-semibold text-white no-underline transition hover:bg-primary-dark"
            >
              {m.notFound.backHome}
            </Link>
            <Link
              to={localePath("/posts")}
              className="rounded-lg border border-black/20 px-5 py-3 font-semibold text-black no-underline transition hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              {m.notFound.browsePosts}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
