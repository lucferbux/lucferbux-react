import SEO from "../components/layout/SEO";
import NewsSection from "../components/news/NewsSection";

export default function NewsPage() {
  return (
    <>
      <SEO title="News" themeColor="#007789" themeColorDark="#2b2830" />
      <NewsSection />
    </>
  );
}
