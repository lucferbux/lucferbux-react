import React, { useEffect } from "react";
import styled from "styled-components";
import { H1 } from "../styles/TextStyles";
import { themes } from "../styles/ColorStyles";
import SocialButton from "../buttons/SocialButton";
import Typewriter from "typewriter-effect";
import MockupAnimation from "../animations/MockupAnimation";
import WaveHero from "../backgrounds/WaveHero";
import { ExternalLink } from "../../data/model/externalLink";

const socialLinks: Array<ExternalLink> = [
  { text: "twitter", image: "twitter", link: "https://twitter.com/lucferbux" },
  { text: "linkedin", image: "linkedin", link: "https://www.linkedin.com/in/lucferbux/" },
  { text: "github", image: "github", link: "https://github.com/lucferbux" },
];

const HeroSection = () => {
  useEffect(() => {})

  return (
    <Wrapper>
      <WaveHero />
      <ContentWrapper>
        <TextWrapper>
          <Title>
            Hi! I’m Lucas,
            <br />
            <span>
              <Typewriter
                onInit={() => {}}
                options={{
                  strings: [
                    "a Web",
                    "an iOS",
                    "an Android",
                    "a ML",
                    "a Backend",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
            Developer
          </Title>
          <Description>
            Welcome to my web. In this site I gather all the news, posts,
            conferences and projects that I take part in.
          </Description>
          <SocialWrapper count={socialLinks.length}>
            {socialLinks.map((item, index) => (
              <SocialButton icon={item.image} link={item.link} key={index} />
            ))}
          </SocialWrapper>
        </TextWrapper>

        <MockupAnimation />
      </ContentWrapper>
    </Wrapper>
  )
}

export default HeroSection

const Wrapper = styled.div`
  overflow: hidden;
  @media (min-width: 2500px) {
    padding-bottom: 100px;
  }

`

interface SocialWrapperProps {
  count: number;
}

const SocialWrapper = styled.div<SocialWrapperProps>`
  display: grid;
  grid-template-columns: repeat(${props => props.count}, auto);
  gap: 0px;
  @media (max-width: 450px) {
    justify-content: space-around;
  }
  
`

const ContentWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 200px 30px;
  display: grid;
  grid-template-columns: 360px auto;

  @media (max-width: 750px) {
    grid-template-columns: auto;
    justify-content: center;
    padding: 150px 20px 290px;
    gap: 60px;
  }
`

const TextWrapper = styled.div`
  max-width: 360px;
  display: grid;
  gap: 30px;
`

const Title = styled(H1)`
  color: ${themes.dark.text1};
  background: linear-gradient(180deg, #613a00 0%, #007789 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  @media (max-width: 450px) {
    font-size: 48px;
  }

  span {
    background: linear-gradient(180deg, #d7fff8 0%, #ffd9b6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
`

const Description = styled.div`
  font-size: 17px;
  line-height: 130%;
`
