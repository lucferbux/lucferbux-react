import { orderBy, limit } from "firebase/firestore";
import { News } from "../../data/model/news";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveNewsHome from "../backgrounds/WaveNewsHome";
import NewsCard from "../cards/NewsCard";
import NewsCardDetail from "../cards/NewsCardDetail";
import InfoBox from "../text/infoBox";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";
import { ExternalLink } from "../../data/model/externalLink";

const button: ExternalLink = { text: "Browse news", image: "courses", link: "news" };

const info = {
  title: "Latest News",
  description: "Here are the latest news related to my professional work",
  button: button,
};

export default function NewsSectionHome() {
  const { data: news, loading, error } = useFirestoreCollection<News>(
    "intro",
    [orderBy("timestamp", "desc"), limit(6)]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load news" />;

  return (
    <div className="relative h-[1000px] overflow-hidden pt-[5px] max-xl:h-[1200px]">
      <WaveNewsHome />

      <div className="mx-auto my-10 flex max-w-[1234px] flex-row items-start justify-between px-[30px] max-xl:flex-col max-xl:items-center max-xl:text-center max-md:h-[720px]">
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={true}
          iconButton={info.button.image}
          textButton={info.button.text}
          linkButton={info.button.link}
          darkColor={true}
        />
        {news?.[0] && <NewsCardDetail news={news[0]} inverted={true} />}
      </div>

      <div className="relative mx-auto -top-10 grid max-w-[1234px] auto-cols-[218px] grid-flow-col gap-5 px-[30px] py-10 max-md:-top-[60px] max-[500px]:px-5 max-2xl:grid-flow-col max-2xl:overflow-x-scroll max-2xl:pb-[120px] max-2xl:[&::-webkit-scrollbar]:hidden">
        {news?.slice(1, 6).map((newsEntry, index) => (
          <NewsCard news={newsEntry} key={index} />
        ))}
      </div>
    </div>
  );
}
