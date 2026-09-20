import SEO from "../components/layout/SEO";
import { useTranslation } from "../i18n/LanguageContext";
import TermsSection from "../components/terms/termsSection";

export default function TermsPage() {
  const { m } = useTranslation();

  return (
    <>
      <SEO
        title={m.pages.terms.title}
        description={m.pages.terms.description}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <TermsSection />
    </>
  );
}
