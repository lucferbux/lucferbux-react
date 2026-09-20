import SEO from "../components/layout/SEO";
import PrivacySection from "../components/terms/privacySection";

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy policy for the Lucferbux personal website"
        themeColor="#007789"
        themeColorDark="#2b2830"
        url="https://lucferbux.dev/privacy"
      />
      <PrivacySection />
    </>
  );
}
