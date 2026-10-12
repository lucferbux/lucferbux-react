import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import PageTitle from "../text/PageTitle";
import TeachingCard from "../cards/TeachingCard";
import LoadingSpinner from "../common/LoadingSpinner";
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

  // Declared before the early returns below, as hooks must be. Until the data
  // arrives the ref is empty and the effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(courses?.length ?? 0, {
    step: 90,
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load courses" />;

  return (
    <div className="h-auto">
      <WaveBody />
      <PageTitle title={info.title} description={info.description} />
      <div
        ref={gridRef}
        className="relative mx-auto grid min-h-[800px] max-w-[1234px] grid-cols-2 items-stretch gap-10 px-[30px] pt-5 pb-20 max-[1020px]:grid-cols-1 max-md:gap-[26px] max-md:px-5"
      >
        {courses?.map((course, index) => (
          <TeachingCard course={course} key={index} />
        ))}
      </div>
    </div>
  );
}
