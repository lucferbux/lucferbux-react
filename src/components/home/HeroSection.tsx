import SocialButton from "../buttons/SocialButton";
import Typewriter from "typewriter-effect";
import MockupAnimation from "../animations/MockupAnimation";
import WaveHero from "../backgrounds/WaveHero";
import { ExternalLink } from "../../data/model/externalLink";

const socialLinks: ExternalLink[] = [
  { text: "twitter", image: "twitter", link: "https://twitter.com/lucferbux" },
  { text: "linkedin", image: "linkedin", link: "https://www.linkedin.com/in/lucferbux/" },
  { text: "github", image: "github", link: "https://github.com/lucferbux" },
];

export default function HeroSection() {
  return (
    <div className="overflow-hidden 4xl:pb-[100px]">
      <WaveHero />
      <div className="relative z-10 mx-auto grid max-w-[1234px] grid-cols-[360px_auto] px-[30px] py-[200px] max-lg:grid-cols-1 max-lg:justify-center max-lg:gap-[60px] max-lg:px-5 max-lg:pt-[150px] max-lg:pb-[290px]">
        <div className="grid max-w-[360px] gap-[30px]">
          <h1
            className="text-[50px] font-bold max-xs:text-[48px]"
            style={{
              background: "linear-gradient(180deg, #613a00 0%, #007789 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Hi! I&apos;m Lucas,
            <br />
            <span
              style={{
                background: "linear-gradient(180deg, #d7fff8 0%, #ffd9b6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              <Typewriter
                onInit={() => {}}
                options={{
                  strings: [
                    "a Full Stack",
                    "an AI",
                    "a Cloud",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
            Developer
          </h1>
          <p className="text-[17px] font-normal leading-[130%] max-xs:text-[15px]">
            Welcome to my web. In this site I gather all the news, posts,
            conferences and projects that I take part in.
          </p>
          <div
            className="grid gap-0 max-xs:justify-around"
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
