import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import WaveBody from "../backgrounds/WaveBody";
import PageTitle from "../text/PageTitle";
import { Post } from "../../data/model/post";
import PostCard from "../cards/PostCard";
import { useStaggeredReveal } from "../../hooks/useStaggeredReveal";
import SkeletonGrid from "../cards/SkeletonGrid";
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

  // Until the data arrives the grid is not mounted, the ref is empty and the
  // effect is a no-op.
  const gridRef = useStaggeredReveal<HTMLDivElement>(posts?.length ?? 0);

  // Shared by the placeholders and the real grid, so nothing moves when the
  // data arrives.
  const grid =
    "relative mx-auto grid min-h-[1000px] max-w-[1234px] grid-cols-2 gap-10 px-[30px] pt-5 pb-20 max-md:grid-cols-1 max-md:gap-[26px] max-md:px-5";

  return (
    <div className="h-auto">
      <WaveBody />
      <PageTitle title={info.title} description={info.description} />
      {loading ? (
        <SkeletonGrid variant="post" count={6} className={grid} />
      ) : error ? (
        <ErrorFallback message="Failed to load posts" />
      ) : (
        <div ref={gridRef} className={grid}>
          {posts?.map((postEntry, index) => (
            <PostCard fill post={postEntry} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
