import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import { News } from "../../data/model/news";
import PageTitle from "../text/PageTitle";
import NewsCardDetail from "../cards/NewsCardDetail";
import { useStaggeredReveal } from "../../hooks/useStaggeredReveal";
import SkeletonGrid from "../cards/SkeletonGrid";
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

  // Until the data arrives the grid is not mounted, the ref is empty and the
  // effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(news?.length ?? 0);

  // Shared by the placeholders and the real grid, so nothing moves when the
  // data arrives.
  const grid =
    "relative mx-auto grid min-h-[1000px] max-w-[1234px] grid-cols-2 gap-10 px-[30px] pt-5 pb-20 max-[1020px]:grid-cols-1 max-md:gap-[26px] max-md:px-5";

  return (
    <div className="h-auto">
      <WaveBody />
      <PageTitle title={info.title} description={info.description} />
      {loading ? (
        <SkeletonGrid variant="news" count={4} className={grid} />
      ) : error ? (
        <ErrorFallback message="Failed to load news" />
      ) : (
        <div ref={gridRef} className={grid}>
          {news?.map((newsEntry, index) => (
            <NewsCardDetail
              fill
              news={newsEntry}
              inverted={index % 2 === 0}
              key={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
