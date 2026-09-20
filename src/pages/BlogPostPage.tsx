import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import SEO from "../components/layout/SEO";
import BlogPost from "../components/blog/BlogPost";
import NotFoundPage from "./NotFoundPage";
import { useTranslation } from "../i18n/LanguageContext";
import { LOCALES, type Locale } from "../i18n/locales";

/**
 * Posts live in `src/content/{locale}/`, keyed by the slug in their
 * frontmatter. The locale comes from the directory rather than a frontmatter
 * field, because a directory cannot drift out of sync with its contents.
 */
const markdownModules = import.meta.glob("../content/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface BlogFrontmatter {
  slug: string;
  date: string;
  title: string;
  featuredImage?: string;
}

interface ParsedPost {
  frontmatter: BlogFrontmatter;
  content: string;
  locale: Locale;
}

/** slug -> locale -> post */
function buildPostIndex(): Map<string, Map<Locale, ParsedPost>> {
  const index = new Map<string, Map<Locale, ParsedPost>>();

  for (const [path, raw] of Object.entries(markdownModules)) {
    const match = path.match(/\/content\/([^/]+)\//);
    const locale = match?.[1] as Locale | undefined;
    if (!locale || !(LOCALES as readonly string[]).includes(locale)) continue;

    const { data, content } = parseFrontmatter<BlogFrontmatter>(raw);
    if (!data.slug) continue;

    const slug = data.slug.replace(/^\//, "");
    if (!index.has(slug)) index.set(slug, new Map());
    index.get(slug)!.set(locale, { frontmatter: data, content, locale });
  }

  return index;
}

const postIndex = buildPostIndex();

/** Every slug that exists in any language — used to validate `internalLink`. */
export const KNOWN_POST_SLUGS: readonly string[] = Array.from(postIndex.keys());

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
