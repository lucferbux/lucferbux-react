import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description?: string;
  lang?: string;
  themeColor?: string;
  themeColorDark?: string;
  image?: string;
  url?: string;
}

const SITE_METADATA = {
  title: "Lucferbux",
  description: "Lucferbux Personal Webpage",
  author: "@lucferbux",
  url: "https://lucferbux.dev",
  twitterUsername: "@lucferbux",
  // Share cards need a raster image: most platforms will not render SVG.
  image: "/icons/icon-512x512.png",
};

/** Social crawlers reject relative URLs, so everything is resolved to absolute. */
function absolute(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl)
    ? pathOrUrl
    : `${SITE_METADATA.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * Every tag is passed as a Helmet child rather than via its `meta` prop.
 *
 * react-helmet-async lets children take precedence over props, and when both
 * are supplied the prop array is dropped entirely. This component used to pass
 * `meta={[...]}` alongside two `<meta>` children, so the live document ended up
 * with only the theme-color tags: no description, no OpenGraph, no Twitter
 * card. Keep everything in children.
 */
export default function SEO({
  title,
  description,
  lang = "en",
  themeColor = "#CA8F36",
  themeColorDark = "#9D7E50",
  image,
  url,
}: SEOProps) {
  const { pathname } = useLocation();

  const metaDescription = description || SITE_METADATA.description;
  const metaImage = absolute(image || SITE_METADATA.image);
  // Default to the page actually being viewed; og:url previously always
  // pointed at the site root, so every shared link looked like the home page.
  const metaUrl = absolute(url || pathname);

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${SITE_METADATA.title}`}
    >
      <link rel="canonical" href={metaUrl} />
      <meta name="description" content={metaDescription} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={SITE_METADATA.twitterUsername} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      <meta
        name="theme-color"
        content={themeColor}
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content={themeColorDark}
        media="(prefers-color-scheme: dark)"
      />
    </Helmet>
  );
}
