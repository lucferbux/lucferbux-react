import SocialButton from "../buttons/SocialButton";
import Typewriter from "typewriter-effect";
import MockupAnimation from "../animations/MockupAnimation";
import WaveHero from "../backgrounds/WaveHero";
import { ExternalLink } from "../../data/model/externalLink";
import { useTranslation } from "../../i18n/LanguageContext";

/**
 * The typewriter animates forever, so in fixture mode (the Playwright visual
 * baseline) we render the first phrase statically instead. Without this every
 * screenshot of the hero would capture a different frame.
 */
const staticTypewriter = import.meta.env.VITE_FIXTURE_DATA === "1";

const socialLinks: ExternalLink[] = [
  {
    text: "instagram",
    image: "instagram",
    link: "https://www.instagram.com/lucferbux",
  },
  {
    text: "linkedin",
    image: "linkedin",
    link: "https://www.linkedin.com/in/lucferbux/",
  },
  { text: "github", image: "github", link: "https://github.com/lucferbux" },
];

export default function HeroSection() {
  const { m } = useTranslation();
  const typewriterStrings = m.hero.roles;

  return (
    <div className="overflow-hidden 4xl:pb-[100px]">
      <WaveHero />
      <div className="relative z-10 mx-auto grid max-w-[1234px] grid-cols-[360px_auto] px-[30px] py-[200px] max-lg:grid-cols-1 max-lg:justify-center max-lg:gap-[60px] max-lg:px-5 max-lg:pt-[150px] max-lg:pb-[290px] max-md:pb-[380px]">
        <div className="grid max-w-[360px] gap-[30px] max-lg:mx-auto max-lg:text-center">
          <h1
            className="text-[50px] font-bold max-xs:text-[48px]"
            style={{
              background: "linear-gradient(180deg, #613a00 0%, #007789 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {m.hero.greeting}
            <br />
            <span
              style={{
                background: "linear-gradient(180deg, #d7fff8 0%, #ffd9b6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {staticTypewriter ? (
                <div className="Typewriter">
                  <span className="Typewriter__wrapper">
                    {typewriterStrings[0]}
                  </span>
                </div>
              ) : (
                <Typewriter
                  onInit={() => {}}
                  options={{
                    strings: [...typewriterStrings],
                    autoStart: true,
                    loop: true,
                  }}
                />
              )}
            </span>
            {m.hero.roleSuffix}
          </h1>
          <p className="text-[17px] font-normal leading-[130%] max-xs:text-[15px] max-xs:leading-[100%]">
            {m.hero.intro}
          </p>
          <div
            className="grid gap-[30px] justify-start max-lg:justify-center max-xs:justify-around"
            style={{
              gridTemplateColumns: `repeat(${socialLinks.length}, auto)`,
            }}
          >
            {socialLinks.map((item, index) => (
              <SocialButton icon={item.image} link={item.link} key={index} />
            ))}
          </div>
        </div>

        <MockupAnimation />
      </div>
    </div>
  );
}
