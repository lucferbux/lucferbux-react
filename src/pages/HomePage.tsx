import SEO from "../components/layout/SEO";
import { useTranslation } from "../i18n/LanguageContext";
import HeroSection from "../components/home/HeroSection";
import NewsSectionHome from "../components/home/NewsSectionHome";
import PostsProjectSection from "../components/home/PostsProjectSection";
import AboutMeSection from "../components/home/AboutMeSection";

export default function HomePage() {
  const { m } = useTranslation();

  return (
    <>
      <SEO title={m.pages.home.title} description={m.pages.home.description} />
      <HeroSection />
      <NewsSectionHome />
      <PostsProjectSection />
      <AboutMeSection />
    </>
  );
}
