import SEO from "../components/layout/SEO";
import { useTranslation } from "../i18n/LanguageContext";
import PostSection from "../components/posts/PostSection";

export default function PostsPage() {
  const { m } = useTranslation();

  return (
    <>
      <SEO
        title={m.pages.posts.title}
        description={m.pages.posts.description}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <PostSection />
    </>
  );
}
