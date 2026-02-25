import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrismPlus from "rehype-prism-plus";
import CodePenEmbed from "./CodePenEmbed";
import WaveBody from "../backgrounds/WaveBody";
import type { Components } from "react-markdown";
import type { ReactNode, ReactElement } from "react";
import "../../styles/blog.css";

interface BlogPostProps {
  title: string;
  date: string;
  featuredImage?: string;
  content: string;
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
      if (
        href &&
        href.match(/^https?:\/\/(www\.)?codepen\.io\/.+\/pen\/.+$/)
      ) {
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
}: BlogPostProps) {
  return (
    <div className="overflow-hidden">
      <WaveBody />
      <div className="relative mx-auto max-w-[800px] px-[30px] pt-[140px] pb-[30px]">
        <h1 className="title-blog">{title}</h1>
        <p className="paragraph-blog mb-4 opacity-70">{date}</p>
        {featuredImage && (
          <img
            src={featuredImage}
            alt="Blog Header"
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
