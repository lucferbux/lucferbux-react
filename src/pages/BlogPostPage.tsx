import { useParams, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import SEO from "../components/layout/SEO";
import BlogPost from "../components/blog/BlogPost";

// Eagerly import all markdown files from src/content as raw strings
const markdownModules = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

interface BlogFrontmatter {
  slug: string;
  date: string;
  title: string;
  featuredImage?: string;
}

interface ParsedPost {
  frontmatter: BlogFrontmatter;
  content: string;
}

/** Parse all markdown files and index by slug (without leading slash). */
function buildPostIndex(): Map<string, ParsedPost> {
  const index = new Map<string, ParsedPost>();

  for (const raw of Object.values(markdownModules)) {
    const { data, content } = parseFrontmatter<BlogFrontmatter>(raw);
    if (data.slug) {
      // Normalize slug: strip leading slash
      const normalizedSlug = data.slug.replace(/^\//, "");
      index.set(normalizedSlug, { frontmatter: data, content });
    }
  }

  return index;
}

// Build once at module level (static — no Firestore needed)
const postIndex = buildPostIndex();

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => {
    if (!slug) return null;
    return postIndex.get(slug) ?? null;
  }, [slug]);

  // T070: Invalid slug → redirect to NotFoundPage
  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const { frontmatter, content } = post;

  return (
    <>
      <SEO title={frontmatter.title} />
      <BlogPost
        title={frontmatter.title}
        date={frontmatter.date}
        featuredImage={frontmatter.featuredImage}
        content={content}
      />
    </>
  );
}
