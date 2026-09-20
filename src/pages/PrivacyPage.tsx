import SEO from "../components/layout/SEO";
import { useTranslation } from "../i18n/LanguageContext";
import PrivacySection from "../components/terms/privacySection";

export default function PrivacyPage() {
  const { m } = useTranslation();

  return (
    <>
      <SEO
        title={m.pages.privacy.title}
        description={m.pages.privacy.description}
        themeColor="#007789"
        themeColorDark="#2b2830"
      />
      <PrivacySection />
    </>
  );
}
