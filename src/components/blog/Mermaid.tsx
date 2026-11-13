import { useEffect, useId, useState } from "react";

interface MermaidProps {
  source: string;
  caption?: string;
}

type Rendered = { light: string; dark: string };

/**
 * Site palette for diagrams. Dark mode is `prefers-color-scheme` only (see
 * AGENTS.md, landmine 5), and Mermaid bakes colours into the SVG, so every
 * diagram is rendered twice and CSS shows the one that matches.
 */
const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

const THEMES = {
  light: {
    fontFamily: FONT,
    fontSize: "17px",
    background: "transparent",
    primaryColor: "#fdf1de",
    primaryBorderColor: "#c98c31",
    primaryTextColor: "#2b2830",
    secondaryColor: "#dcf0f2",
    secondaryBorderColor: "#007789",
    secondaryTextColor: "#12363b",
    tertiaryColor: "#f3eefe",
    tertiaryBorderColor: "#7c5cf0",
    tertiaryTextColor: "#2b2830",
    lineColor: "#6b7a80",
    textColor: "#2b2830",
    mainBkg: "#fdf1de",
    nodeBorder: "#c98c31",
    clusterBkg: "#f6f8f9",
    clusterBorder: "#c9d3d6",
    titleColor: "#2b2830",
    edgeLabelBackground: "#ffffff",
    actorBkg: "#dcf0f2",
    actorBorder: "#007789",
    actorTextColor: "#12363b",
    signalColor: "#4a5a60",
    signalTextColor: "#2b2830",
    labelBoxBkgColor: "#fdf1de",
    labelBoxBorderColor: "#c98c31",
    noteBkgColor: "#fff7e0",
    noteBorderColor: "#eabe7d",
    noteTextColor: "#2b2830",
    activationBkgColor: "#eabe7d",
    activationBorderColor: "#c98c31",
    sequenceNumberColor: "#ffffff",
    git0: "#c98c31",
    git1: "#007789",
    git2: "#7c5cf0",
  },
  dark: {
    fontFamily: FONT,
    fontSize: "17px",
    darkMode: true,
    background: "transparent",
    primaryColor: "#3a2f1f",
    primaryBorderColor: "#eabe7d",
    primaryTextColor: "#f6efe4",
    secondaryColor: "#123b40",
    secondaryBorderColor: "#4fb3c1",
    secondaryTextColor: "#e3f4f6",
    tertiaryColor: "#2a2340",
    tertiaryBorderColor: "#ad92fd",
    tertiaryTextColor: "#efeaff",
    lineColor: "#93a3a8",
    textColor: "#eef1f2",
    mainBkg: "#3a2f1f",
    nodeBorder: "#eabe7d",
    clusterBkg: "#1f2226",
    clusterBorder: "#3b4248",
    titleColor: "#eef1f2",
    edgeLabelBackground: "#2a2c31",
    actorBkg: "#123b40",
    actorBorder: "#4fb3c1",
    actorTextColor: "#e3f4f6",
    signalColor: "#b8c4c8",
    signalTextColor: "#eef1f2",
    labelBoxBkgColor: "#3a2f1f",
    labelBoxBorderColor: "#eabe7d",
    noteBkgColor: "#3b3322",
    noteBorderColor: "#a08153",
    noteTextColor: "#f6efe4",
    activationBkgColor: "#a08153",
    activationBorderColor: "#eabe7d",
    sequenceNumberColor: "#1b1d21",
    git0: "#eabe7d",
    git1: "#4fb3c1",
    git2: "#ad92fd",
  },
} as const;

/**
 * Timeline, mindmap and journey sections cycle through `cScale0…11`; anything
 * left undefined falls back to Mermaid's own lime and black.
 */
function scale(fills: string[], labels: string[], lines: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < 12; i += 1) {
    out[`cScale${i}`] = fills[i % fills.length];
    out[`cScaleLabel${i}`] = labels[i % labels.length];
    out[`cScaleInv${i}`] = lines[i % lines.length];
    out[`cScalePeer${i}`] = lines[i % lines.length];
  }
  return out;
}

const PALETTES = {
  light: {
    ...THEMES.light,
    ...scale(
      ["#fdf1de", "#dcf0f2", "#f3eefe", "#fbe3d6"],
      ["#2b2830", "#12363b", "#2b2830", "#3b2418"],
      ["#c98c31", "#007789", "#7c5cf0", "#c8643b"]
    ),
  },
  dark: {
    ...THEMES.dark,
    ...scale(
      ["#3a2f1f", "#123b40", "#2a2340", "#3b2419"],
      ["#f6efe4", "#e3f4f6", "#efeaff", "#f8e3d8"],
      ["#eabe7d", "#4fb3c1", "#ad92fd", "#f0a07a"]
    ),
  },
};

/**
 * Mermaid's configuration is global, so the two themes cannot render at the
 * same time. Every render on the page goes through this one queue.
 */
let queue: Promise<unknown> = Promise.resolve();

function render(id: string, source: string): Promise<Rendered> {
  const job = queue.then(async () => {
    // Its own chunk, loaded only by an article that has a diagram.
    const { default: mermaid } = await import("mermaid");
    const out = {} as Rendered;
    for (const scheme of ["light", "dark"] as const) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: PALETTES[scheme],
        flowchart: {
          curve: "basis",
          padding: 16,
          nodeSpacing: 40,
          rankSpacing: 50,
          htmlLabels: true,
        },
        sequence: { mirrorActors: false, actorMargin: 60 },
      });
      const { svg } = await mermaid.render(`${id}-${scheme}`, source);
      out[scheme] = svg;
    }
    return out;
  });
  queue = job.catch(() => undefined);
  return job;
}

export default function Mermaid({ source, caption }: MermaidProps) {
  const id = `mmd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<Rendered | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    render(id, source).then(
      (out) => live && setSvg(out),
      () => live && setFailed(true)
    );
    return () => {
      live = false;
    };
  }, [id, source]);

  const state = failed ? "error" : svg ? "ready" : "pending";

  return (
    <figure className="diagram-blog" data-diagram={state}>
      {svg ? (
        <>
          <div
            className="diagram-svg diagram-light"
            dangerouslySetInnerHTML={{ __html: svg.light }}
          />
          <div
            className="diagram-svg diagram-dark"
            dangerouslySetInnerHTML={{ __html: svg.dark }}
          />
        </>
      ) : failed ? (
        <pre className="diagram-fallback">{source}</pre>
      ) : (
        <div className="diagram-placeholder" aria-hidden="true" />
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
