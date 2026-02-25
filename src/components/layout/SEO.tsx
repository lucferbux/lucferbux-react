import { Helmet } from "react-helmet-async";

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
  image: "/images/logos/logo-icon.svg",
};

export default function SEO({
  title,
  description,
  lang = "en",
  themeColor = "#CA8F36",
  themeColorDark = "#9D7E50",
  image,
  url,
}: SEOProps) {
  const metaDescription = description || SITE_METADATA.description;
  const metaImage = image || SITE_METADATA.image;
  const metaUrl = url || SITE_METADATA.url;

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${SITE_METADATA.title}`}
      meta={[
        { name: "description", content: metaDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:image", content: metaImage },
        { property: "og:url", content: metaUrl },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:creator", content: SITE_METADATA.twitterUsername },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: metaDescription },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      ]}
    >
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
