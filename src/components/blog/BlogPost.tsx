import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import CodeBlock from "./CodeBlock";
import Mermaid from "./Mermaid";
import Steps from "./Steps";
import {
  remarkCallouts,
  rehypeBlocks,
  type CalloutKind,
} from "./markdown/plugins";
import remarkGfm from "remark-gfm";
import rehypePrismPlus from "rehype-prism-plus";
import CodePenEmbed from "./CodePenEmbed";
import WaveBody from "../backgrounds/WaveBody";
import type { Components } from "react-markdown";
import { useMemo } from "react";
import type { ReactNode, ReactElement } from "react";
import "../../styles/blog.css";
import { useTranslation, type Messages } from "../../i18n/LanguageContext";
import { formatDate } from "../../i18n/formatDate";
import { Link } from "react-router";
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

/** Plain text of rendered children, for heading anchors. */
function textOf(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textOf(
      (children as ReactElement<{ children?: ReactNode }>).props.children
    );
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Props = Record<string, unknown> | undefined;
const prop = (props: Props, key: string) =>
  typeof props?.[key] === "string" ? (props[key] as string) : undefined;

const makeComponents = (
  localePath: (p: string) => string,
  m: Messages
): Components => ({
  // Override <p> to detect CodePen URLs
  p({ children }) {
    const codepenUrl = isCodePenUrl(children);
    if (codepenUrl) {
      return <CodePenEmbed url={codepenUrl} />;
    }
    return <p className="paragraph-blog">{children}</p>;
  },
  h1({ children }) {
    return <h2 className="subtitle-blog">{children}</h2>;
  },
  h2({ children }) {
    const id = slugify(textOf(children));
    return (
      <h2 id={id} className="subtitle-blog">
        <a href={`#${id}`} className="anchor-blog" aria-label={m.blog.anchor}>
          #
        </a>
        {children}
      </h2>
    );
  },
  h3({ children }) {
    const id = slugify(textOf(children));
    return (
      <h3 id={id} className="emphasis-title-blog">
        <a href={`#${id}`} className="anchor-blog" aria-label={m.blog.anchor}>
          #
        </a>
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return <h4 className="minor-title-blog">{children}</h4>;
  },
  a({ href, children }) {
    // Internal cross-links between articles stay in the tab and keep the
    // reader's language. Every link used to get `target="_blank"`, so a link to
    // another article on this site opened a second tab at an unprefixed path,
    // which is neither where the reader was nor in the language they were
    // reading.
    if (href?.startsWith("/")) {
      return (
        <Link to={localePath(href)} className="link-blog">
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className="link-blog">
          {children}
        </a>
      );
    }
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
  ul({ children, className }) {
    return (
      <ul className={clsx("list-blog-unordered", className)}>{children}</ul>
    );
  },
  ol({ children, start }) {
    return (
      <ol className="list-blog-ordered" start={start}>
        {children}
      </ol>
    );
  },
  li({ children, className }) {
    return <li className={clsx("list-item", className)}>{children}</li>;
  },
  img({ src, alt, title }) {
    // `![alt](src "Caption")` — the title becomes a visible caption.
    return (
      <span className="figure-blog">
        <img
          src={typeof src === "string" ? src : undefined}
          alt={alt ?? ""}
          className="image-container-blog"
          loading="lazy"
        />
        {title && <span className="figure-blog-caption">{title}</span>}
      </span>
    );
  },
  strong({ children }) {
    return <strong className="strong-blog">{children}</strong>;
  },
  blockquote({ node, children }) {
    const kind = prop(node?.properties, "dataCallout") as
      CalloutKind | undefined;
    if (kind) {
      return (
        <aside className="callout-blog" data-callout={kind}>
          <p className="callout-blog-label">{m.blog.callout[kind]}</p>
          {children}
        </aside>
      );
    }
    return <blockquote className="quote-blog">{children}</blockquote>;
  },
  table({ children }) {
    return (
      <div className="table-blog">
        <table>{children}</table>
      </div>
    );
  },
  hr() {
    return <hr className="rule-blog" />;
  },
  pre({ node, children, className }) {
    const props = node?.properties;
    const block = prop(props, "dataBlock");
    const source = prop(props, "dataSource") ?? "";
    const meta = prop(props, "dataMeta");
    const title = prop(props, "dataTitle");
    if (block === "mermaid") return <Mermaid source={source} caption={title} />;
    if (block === "steps") return <Steps source={source} meta={meta} />;
    return (
      <CodeBlock
        language={prop(props, "dataLanguage")}
        title={title}
        className={className}
      >
        {children}
      </CodeBlock>
    );
  },
});

export default function BlogPost({
  title,
  date,
  featuredImage,
  content,
  notice,
}: BlogPostProps) {
  const { locale, m } = useTranslation();
  const localePath = useLocalePath();
  const components = useMemo(
    () => makeComponents(localePath, m),
    [localePath, m]
  );

  return (
    <div className="overflow-hidden">
      <WaveBody />
      <div className="relative mx-auto max-w-[800px] px-[30px] pt-page pb-[30px] [--page-gap:84px] max-md:px-5 max-md:[--page-gap:24px]">
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
        <article className="prose-blog">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkCallouts]}
            rehypePlugins={[
              rehypeBlocks,
              [rehypePrismPlus, { ignoreMissing: true }],
            ]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
