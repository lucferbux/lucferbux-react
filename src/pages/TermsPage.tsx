import SEO from "../components/layout/SEO";
import TermsSection from "../components/terms/termsSection";

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Terms and conditions for the Lucferbux personal website"
        themeColor="#007789"
        themeColorDark="#2b2830"
        url="https://lucferbux.dev/terms"
      />
      <TermsSection />
    </>
  );
}
