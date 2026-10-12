import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import { News } from "../../data/model/news";
import PageTitle from "../text/PageTitle";
import NewsCardDetail from "../cards/NewsCardDetail";
import { useStaggeredReveal } from "../../hooks/useStaggeredReveal";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";
import { useTranslation } from "../../i18n/LanguageContext";

export default function NewsSection() {
  const { m } = useTranslation();
  const info = m.sections.news;
  const {
    data: news,
    loading,
    error,
  } = useFirestoreCollection<News>("intro", {
    orderBy: [["timestamp", "desc"]],
  });

  // Declared before the early returns below, as hooks must be. Until the
  // data arrives the ref is empty and the effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(news?.length ?? 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load news" />;

  return (
    <div className="h-auto">
      <WaveBody />
      <PageTitle title={info.title} description={info.description} />
      <div
        ref={gridRef}
        className="relative mx-auto grid min-h-[1000px] max-w-[1234px] grid-cols-2 gap-10 px-[30px] pt-5 pb-20 max-[1020px]:grid-cols-1 max-md:gap-[26px] max-md:px-5"
      >
        {news?.map((newsEntry, index) => (
          <NewsCardDetail
            fill
            news={newsEntry}
            inverted={index % 2 === 0}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
