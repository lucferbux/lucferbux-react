import { orderBy } from "firebase/firestore";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import InfoBox from "../text/infoBox";
import { Post } from "../../data/model/post";
import PostCard from "../cards/PostCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";

const info = {
  title: "Tech Posts",
  description:
    "Personal posts and collaborations talking about multiple fields of Technology such as Development, Security, AI...",
};

export default function PostSection() {
  const { data: posts, loading, error } = useFirestoreCollection<Post>(
    "patent",
    [orderBy("date", "desc")]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load posts" />;

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
        {posts?.map((postEntry, index) => (
          <PostCard post={postEntry} key={index} />
        ))}
      </div>
    </div>
  );
}