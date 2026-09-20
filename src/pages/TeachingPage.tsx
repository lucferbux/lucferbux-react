import SEO from "../components/layout/SEO";
import TeachingSection from "../components/teaching/TeachingSection";
import { useTranslation } from "../i18n/LanguageContext";

export default function TeachingPage() {
  const { m } = useTranslation();

  return (
    <>
      <SEO
        title={m.pages.teaching.title}
        description={m.pages.teaching.description}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <TeachingSection />
    </>
  );
}
