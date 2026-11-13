import type { CSSProperties } from "react";

interface StepsProps {
  source: string;
  /** `loop` in the fence meta draws the way back from the last step. */
  meta?: string;
}

interface Step {
  title: string;
  body?: string;
}

/** One step per line: `Title: what happens in it`. */
function parse(source: string): Step[] {
  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.indexOf(":");
      if (at === -1) return { title: line };
      return {
        title: line.slice(0, at).trim(),
        body: line.slice(at + 1).trim() || undefined,
      };
    });
}

/**
 * A numbered sequence — a process, a cycle, a pipeline. Horizontal on wide
 * screens, a vertical timeline on narrow ones.
 *
 * ```steps loop
 * Specify: One page: problem, constraints, what to reuse, how to check.
 * Plan: The agent proposes; you correct the plan, not the code.
 * ```
 */
export default function Steps({ source, meta = "" }: StepsProps) {
  const steps = parse(source);
  const loop = /\bloop\b/.test(meta);
  const loopLabel = meta.match(/loop="([^"]*)"/)?.[1];

  return (
    <figure
      className="steps-blog"
      style={{ "--steps": Math.min(steps.length, 5) } as CSSProperties}
    >
      <ol>
        {steps.map((step, i) => (
          <li key={i}>
            <span className="steps-blog-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <strong>{step.title}</strong>
            {step.body && <span>{step.body}</span>}
          </li>
        ))}
      </ol>
      {loop && (
        <figcaption className="steps-blog-loop">
          <span aria-hidden="true">↺</span>
          {loopLabel ??
            `${steps[steps.length - 1]?.title} → ${steps[0]?.title}`}
        </figcaption>
      )}
    </figure>
  );
}
