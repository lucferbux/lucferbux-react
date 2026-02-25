interface CodePenEmbedProps {
  url: string;
  height?: number;
  theme?: string;
}

/** Renders a CodePen URL as a responsive iframe embed. */
export default function CodePenEmbed({
  url,
  height = 400,
  theme = "dark",
}: CodePenEmbedProps) {
  // Convert CodePen URL to embed URL
  // e.g. https://codepen.io/lucferbux/pen/eYVWaKP → https://codepen.io/lucferbux/embed/eYVWaKP
  const embedUrl = url
    .replace("/pen/", "/embed/")
    .concat(`?default-tab=result&theme-id=${theme}`);

  return (
    <div className="my-6 w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
      <iframe
        height={height}
        className="w-full"
        scrolling="no"
        title="CodePen Embed"
        src={embedUrl}
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          See the Pen on CodePen
        </a>
      </iframe>
    </div>
  );
}
