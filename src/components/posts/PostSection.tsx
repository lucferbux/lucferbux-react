import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import PageTitle from "../text/PageTitle";
import { Post } from "../../data/model/post";
import PostCard from "../cards/PostCard";
import { useStaggeredReveal } from "../../hooks/useStaggeredReveal";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorFallback from "../common/ErrorFallback";
import { useTranslation } from "../../i18n/LanguageContext";

export default function PostSection() {
  const { m } = useTranslation();
  const info = m.sections.posts;
  const {
    data: posts,
    loading,
    error,
  } = useFirestoreCollection<Post>("patent", { orderBy: [["date", "desc"]] });

  // Declared before the early returns below, as hooks must be. Until the
  // data arrives the ref is empty and the effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(posts?.length ?? 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback message="Failed to load posts" />;

  return (
    <div className="h-auto">
      <WaveBody />
      <PageTitle title={info.title} description={info.description} />
      <div
        ref={gridRef}
        className="relative mx-auto grid min-h-[1000px] max-w-[1234px] grid-cols-2 gap-10 px-[30px] pt-5 pb-20 max-md:grid-cols-1 max-md:gap-[26px] max-md:px-5"
      >
        {posts?.map((postEntry, index) => (
          <PostCard fill post={postEntry} key={index} />
        ))}
      </div>
    </div>
  );
}
