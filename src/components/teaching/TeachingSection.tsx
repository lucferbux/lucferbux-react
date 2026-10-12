import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import PageTitle from "../text/PageTitle";
import TeachingCard from "../cards/TeachingCard";
import SkeletonGrid from "../cards/SkeletonGrid";
import ErrorFallback from "../common/ErrorFallback";
import { useTranslation } from "../../i18n/LanguageContext";
import type { Teaching } from "../../data/model/teaching";
import { useStaggeredReveal } from "../../hooks/useStaggeredReveal";

export default function TeachingSection() {
  const { m } = useTranslation();
  const info = m.sections.teaching;
  const {
    data: courses,
    loading,
    error,
  } = useFirestoreCollection<Teaching>("teaching", {
    orderBy: [["importance", "asc"]],
  });

  // Until the data arrives the grid is not mounted, the ref is empty and the
  // effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(courses?.length ?? 0, {
    step: 90,
  });

  // Shared by the placeholders and the real grid, so nothing moves when the
  // data arrives.
  const grid =
    "relative mx-auto grid min-h-[800px] max-w-[1234px] grid-cols-2 items-stretch gap-10 px-[30px] pt-5 pb-20 max-[1020px]:grid-cols-1 max-md:gap-[26px] max-md:px-5";

  return (
    <div className="h-auto">
      <WaveBody />
      <PageTitle title={info.title} description={info.description} />
      {loading ? (
        <SkeletonGrid variant="teaching" count={4} className={grid} />
      ) : error ? (
        <ErrorFallback message="Failed to load courses" />
      ) : (
        <div ref={gridRef} className={grid}>
          {courses?.map((course, index) => (
            <TeachingCard course={course} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
