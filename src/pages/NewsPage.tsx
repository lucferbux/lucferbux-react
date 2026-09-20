import SEO from "../components/layout/SEO";
import { useTranslation } from "../i18n/LanguageContext";
import NewsSection from "../components/news/NewsSection";

export default function NewsPage() {
  const { m } = useTranslation();

  return (
    <>
      <SEO
        title={m.pages.news.title}
        description={m.pages.news.description}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <NewsSection />
    </>
  );
}
