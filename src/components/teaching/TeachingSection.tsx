import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import InfoBox from "../text/infoBox";
import TeachingCard from "../cards/TeachingCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";
import { useTranslation } from "../../i18n/LanguageContext";
import type { Teaching } from "../../data/model/teaching";

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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load courses" />;

  return (
    <div className="h-auto">
      <WaveBody />
      <div className="relative mx-auto grid max-w-[1234px] grid-cols-[360px_auto] px-[30px] pt-[150px] pb-[30px] max-xl:grid-cols-1 max-xl:justify-items-center max-xl:text-center max-md:px-[30px] max-md:pt-[120px] max-md:pb-[10px]">
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={false}
        />
      </div>
      <div className="relative mx-auto grid min-h-[800px] max-w-[1234px] grid-cols-2 items-stretch gap-10 px-[30px] pt-5 pb-20 max-[1020px]:grid-cols-1 max-[1020px]:justify-items-center max-md:gap-[26px]">
        {courses?.map((course, index) => (
          <TeachingCard course={course} key={index} />
        ))}
      </div>
    </div>
  );
}
