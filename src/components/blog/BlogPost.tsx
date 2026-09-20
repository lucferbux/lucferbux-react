import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrismPlus from "rehype-prism-plus";
import CodePenEmbed from "./CodePenEmbed";
import WaveBody from "../backgrounds/WaveBody";
import type { Components } from "react-markdown";
import type { ReactNode, ReactElement } from "react";
import "../../styles/blog.css";
import { useTranslation } from "../../i18n/LanguageContext";
import { formatDate } from "../../i18n/formatDate";
import { Link } from "react-router-dom";
import { useLocalePath } from "../../i18n/useLocalePath";

interface BlogPostProps {
  title: string;
  date: string;
  featuredImage?: string;
  content: string;
  /** Shown when the reader's language has no translation of this post. */
  notice?: string;
}

/** Detects if a paragraph's only child is a CodePen link and renders an embed. */
function isCodePenUrl(children: ReactNode): string | null {
  // react-markdown wraps bare URLs in <a> tags via remark-gfm autolinks
  // Check if the only child is a string that is a codepen URL
  if (typeof children === "string") {
    const trimmed = children.trim();
    if (trimmed.match(/^https?:\/\/(www\.)?codepen\.io\/.+\/pen\/.+$/)) {
      return trimmed;
    }
  }

  // Check if children is an array with a single <a> element pointing to codepen
  if (Array.isArray(children) && children.length === 1) {
    const child = children[0];
    if (
      child &&
      typeof child === "object" &&
      "props" in (child as ReactElement)
    ) {
      const el = child as ReactElement<{ href?: string; children?: ReactNode }>;
      const href = el.props?.href;
      if (href && href.match(/^https?:\/\/(www\.)?codepen\.io\/.+\/pen\/.+$/)) {
        return href;
      }
    }
  }

  return null;
}

const components: Components = {
  // Override <p> to detect CodePen URLs
  p({ children }) {
    const codepenUrl = isCodePenUrl(children);
    if (codepenUrl) {
      return <CodePenEmbed url={codepenUrl} />;
    }
    return <p className="paragraph-blog">{children}</p>;
  },
  h1({ children }) {
    return <h1 className="title-blog">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="subtitle-blog">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="emphasis-title-blog">{children}</h3>;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        className="link-blog"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  ul({ children }) {
    return <ul className="list-blog-unordered">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-blog-ordered">{children}</ol>;
  },
  li({ children }) {
    return <li className="list-item">{children}</li>;
  },
  img({ src, alt }) {
    return (
      <img
        src={src}
        alt={alt ?? ""}
        className="image-container-blog"
        loading="lazy"
      />
    );
  },
  strong({ children }) {
    return <strong className="strong-blog">{children}</strong>;
  },
};

export default function BlogPost({
  title,
  date,
  featuredImage,
  content,
  notice,
}: BlogPostProps) {
  const { locale, m } = useTranslation();
  const localePath = useLocalePath();

  return (
    <div className="overflow-hidden">
      <WaveBody />
      <div className="relative mx-auto max-w-[800px] px-[30px] pt-[140px] pb-[30px]">
        {/* A post is usually arrived at from a card somewhere else on the
            site, and the only way back was the browser's own button — which an
            installed PWA does not show. `blog.backToPosts` was already in both
            dictionaries, just never rendered. */}
        <Link
          to={localePath("/posts")}
          className="motion-glass mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.06] px-4 py-2 text-[14px] font-semibold !text-black no-underline hover:bg-black/12 dark:border-white/15 dark:bg-white/10 dark:!text-white dark:hover:bg-white/20"
        >
          <span aria-hidden="true">&larr;</span>
          {m.blog.backToPosts}
        </Link>
        <h1 className="title-blog">{title}</h1>
        <p className="paragraph-blog mb-4 opacity-70">
          {formatDate(date, locale)}
        </p>
        {notice && (
          <p
            role="note"
            className="mb-6 rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-[15px] text-black/70 dark:border-white/15 dark:bg-white/10 dark:text-white/70"
          >
            {notice}
          </p>
        )}
        {featuredImage && (
          <img
            src={featuredImage}
            alt=""
            className="image-container-blog"
            loading="lazy"
          />
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypePrismPlus]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
