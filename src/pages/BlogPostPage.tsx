import { useParams } from "react-router";
import { useMemo } from "react";
import SEO from "../components/layout/SEO";
import BlogPost from "../components/blog/BlogPost";
import NotFoundPage from "./NotFoundPage";
import { useTranslation } from "../i18n/LanguageContext";
import { postIndex } from "../data/posts";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, m } = useTranslation();

  const post = useMemo(() => {
    if (!slug) return null;
    const byLocale = postIndex.get(slug);
    if (!byLocale) return null;
    // Prefer the reader's language, but show the post rather than a 404 when
    // only the other translation exists.
    return byLocale.get(locale) ?? byLocale.values().next().value ?? null;
  }, [slug, locale]);

  if (!post) return <NotFoundPage />;

  const { frontmatter, content } = post;
  const isTranslated = post.locale === locale;

  return (
    <>
      <SEO
        title={frontmatter.title}
        image={frontmatter.featuredImage}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <BlogPost
        title={frontmatter.title}
        date={frontmatter.date}
        featuredImage={frontmatter.featuredImage}
        content={content}
        notice={isTranslated ? undefined : m.blog.onlyAvailableIn[post.locale]}
      />
    </>
  );
}
