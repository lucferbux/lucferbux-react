import SEO from "../components/layout/SEO";
import HeroSection from "../components/home/HeroSection";
import NewsSectionHome from "../components/home/NewsSectionHome";
import PostsProjectSection from "../components/home/PostsProjectSection";
import AboutMeSection from "../components/home/AboutMeSection";

export default function HomePage() {
  return (
    <>
      <SEO title="Home" />
      <HeroSection />
      <NewsSectionHome />
      <PostsProjectSection />
      <AboutMeSection />
    </>
  );
}
