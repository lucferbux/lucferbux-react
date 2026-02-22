import { orderBy } from "firebase/firestore";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveResumeeHome from "../backgrounds/WaveResumeeHome";
import InfoBox from "../text/infoBox";
import { Work } from "../../data/model/work";
import ResumeeCard from "../cards/ResumeeCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";

const info = {
  title: "My Resumée",
  description: "Here are the most important roles I've taken so far",
};

export default function AboutMeSection() {
  const { data: works, loading, error } = useFirestoreCollection<Work>(
    "team",
    [orderBy("importance", "asc")]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load work experience" />;

  return (
    <div className="relative h-[1000px] overflow-hidden pt-[5px] max-md:h-[1200px] max-xs:h-[1180px]">
      <WaveResumeeHome />
      <img
        src="/images/waves/resumee-wave6.svg"
        alt="Background Image"
        className="resumee-wave6 absolute -bottom-[10px] z-[-1] hidden 3xl:block 3xl:w-full 4xl:-bottom-[280px] 4xl:block 4xl:w-full"
      />

      <div className="mx-auto grid max-w-[1234px] justify-items-center px-5 pt-[120px] pb-5 text-center 3xl:pt-[170px] 4xl:pt-[200px] max-lg:pt-[60px]">
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={false}
          darkColor={false}
        />
      </div>

      <div className="grid justify-items-center">
        {works.length > 0 && <ResumeeCard works={works} />}
      </div>
    </div>
  );
}