import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "../../i18n/LanguageContext";

interface CodeBlockProps {
  language?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  javascript: "JavaScript",
  py: "Python",
  python: "Python",
  go: "Go",
  swift: "Swift",
  kotlin: "Kotlin",
  kt: "Kotlin",
  objc: "Objective-C",
  objectivec: "Objective-C",
  java: "Java",
  rust: "Rust",
  yaml: "YAML",
  yml: "YAML",
  json: "JSON",
  bash: "Shell",
  sh: "Shell",
  shell: "Shell",
  zsh: "Shell",
  dockerfile: "Dockerfile",
  docker: "Dockerfile",
  md: "Markdown",
  markdown: "Markdown",
  css: "CSS",
  html: "HTML",
  sql: "SQL",
  toml: "TOML",
  diff: "Diff",
  text: "Text",
  txt: "Text",
};

/**
 * A fenced code block: a header with the file name (```ts title="api.ts") or
 * the language, and a copy button. The highlighted <code> comes from
 * rehype-prism-plus untouched.
 */
export default function CodeBlock({
  language,
  title,
  children,
  className,
}: CodeBlockProps) {
  const { m } = useTranslation();
  const pre = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const label = language ? (LANGUAGE_NAMES[language] ?? language) : undefined;

  async function copy() {
    const text = pre.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access denied (insecure context, permissions): nothing to do.
    }
  }

  return (
    <figure className="code-blog">
      <figcaption className="code-blog-header">
        <span className="code-blog-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {title ? (
          <span className="code-blog-title">{title}</span>
        ) : (
          <span className="code-blog-title" />
        )}
        {label && <span className="code-blog-lang">{label}</span>}
        <button
          type="button"
          className="code-blog-copy"
          onClick={copy}
          aria-label={copied ? m.blog.copiedCode : m.blog.copyCodeLabel}
        >
          {copied ? m.blog.copiedCode : m.blog.copyCode}
        </button>
      </figcaption>
      <pre ref={pre} className={className}>
        {children}
      </pre>
    </figure>
  );
}
