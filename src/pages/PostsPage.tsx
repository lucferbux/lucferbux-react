import SEO from "../components/layout/SEO";
import PostSection from "../components/posts/PostSection";

export default function PostsPage() {
  return (
    <>
      <SEO title="Posts" themeColor="#007789" themeColorDark="#2b2830" />
      <PostSection />
    </>
  );
}
