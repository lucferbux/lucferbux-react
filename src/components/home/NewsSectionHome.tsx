import { News } from "../../data/model/news";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveNewsHome from "../backgrounds/WaveNewsHome";
import NewsCard from "../cards/NewsCard";
import NewsCardDetail from "../cards/NewsCardDetail";
import InfoBox from "../text/infoBox";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";
import { useTranslation } from "../../i18n/LanguageContext";

export default function NewsSectionHome() {
  const { m } = useTranslation();
  const info = m.sections.newsHome;
  const {
    data: news,
    loading,
    error,
  } = useFirestoreCollection<News>("intro", {
    orderBy: [["timestamp", "desc"]],
    limit: 6,
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load news" />;

  return (
    <div className="relative h-[1000px] overflow-hidden pt-[5px] max-xl:h-[1200px]">
      <WaveNewsHome />

      <div className="mx-auto my-10 flex max-w-[1234px] flex-row items-start justify-between px-[30px] py-5 max-xl:flex-col max-xl:items-center max-xl:text-center max-md:h-auto">
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={true}
          iconButton="courses"
          textButton={info.button}
          linkButton="news"
          darkColor={true}
        />
        {news?.[0] && <NewsCardDetail news={news[0]} inverted={true} />}
      </div>

      {/* `pb` was 120px here, reserving room for a scrollbar that the rule
          below hides anyway, which pushed the box past a fixed-height
          `overflow-hidden` section and clipped the row on narrow screens. It
          went to 32px, which turned out to be too far the other way: the
          cards' shadow reaches 60px below them and was being cut off. 64px
          clears it, and it is unconditional now — the breakpoint-scoped
          version left the widest layout on the old 40px, where the shadow was
          still being cut. */}
      <div className="relative mx-auto my-10 -top-10 grid max-w-[1234px] grid-cols-[repeat(auto-fit,218px)] justify-items-center gap-5 px-[30px] pt-10 pb-16 max-md:-top-[60px] max-[500px]:px-5 max-2xl:grid-cols-[repeat(5,minmax(200px,1fr))] max-2xl:overflow-x-scroll max-2xl:[&::-webkit-scrollbar]:hidden">
        {news?.slice(1, 6).map((newsEntry, index) => (
          <NewsCard news={newsEntry} key={index} />
        ))}
      </div>
    </div>
  );
}
