import { orderBy } from "firebase/firestore";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import { News } from "../../data/model/news";
import InfoBox from "../text/infoBox";
import NewsCardDetail from "../cards/NewsCardDetail";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";

const info = {
  title: "Latest News",
  description: "Here are the latest news related to my professional work",
};

export default function NewsSection() {
  const { data: news, loading, error } = useFirestoreCollection<News>(
    "intro",
    [orderBy("timestamp", "desc")]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load news" />;

  return (
    <div className="h-auto">
      <WaveBody />
      <div className="mx-auto grid max-w-[1234px] grid-cols-[360px_auto] px-[30px] pt-[150px] pb-[30px] max-xl:grid-cols-1 max-xl:justify-items-center max-xl:text-center max-md:px-[30px] max-md:pt-[120px] max-md:pb-[10px]">
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={false}
        />
      </div>
      <div className="mx-auto grid min-h-[1000px] max-w-[1234px] grid-cols-2 gap-10 px-[30px] pt-5 pb-20 max-[1020px]:grid-cols-1 max-[1020px]:justify-items-center max-md:gap-[26px]">
        {news?.map((newsEntry, index) => (
          <NewsCardDetail news={newsEntry} inverted={index % 2 === 0} key={index} />
        ))}
      </div>
    </div>
  );
}