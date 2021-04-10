import React, { useEffect } from "react"
import styled from "styled-components"
import { ExternalLink } from "../../data/model/externalLink"
import { News } from "../../data/model/news"
import { Work } from "../../data/model/work"
import { themes } from "../styles/ColorStyles"
import { Caption, H2, H3, DescriptionCard } from "../styles/TextStyles"
import NewsCard from "./NewsCard"
import NewsCardCollapsed from "./NewsCardCollapsed"
import ResumeeCardRow from "./ResumeeCardRow"
import ResumeeHeader from "./ResumeeHeader"

interface ResumeeCardProps {
  works: Array<Work>
}

const buttons: Array<ExternalLink> = [
  { text: "twitter", image: "twitter", link: "https://twitter.com/lucferbux" },
  {
    text: "instagram",
    image: "instagram",
    link: "https://instagram.com/lucferbux",
  },
]

const headerInfo = {
  title: "Lucas Fernández",
  caption: "DEVELOPER",
  description: "I love to learn & discover new technologies everyday.",
  buttons: buttons,
}

const ResumeeCard = (props: ResumeeCardProps) => {
  const { works } = props

  return (
    <Wrapper>
      <ResumeeCardWrapper>
        <ResumeeHeader
          title={headerInfo.title}
          caption={headerInfo.caption}
          description={headerInfo.description}
          buttons={headerInfo.buttons}
        />
      </ResumeeCardWrapper>
      <WorkWrapper>
        <Title>Experience</Title>
        <ListWrapper>
          {
          works.map((workInstance, index) => (
            <ResumeeCardRow work={workInstance} key={index} />
          ))
          }
        </ListWrapper>
      </WorkWrapper>
    </Wrapper>
  )
}

export default ResumeeCard

const Wrapper = styled.div`
  max-width: 786px;
  width: auto;
  height: 400px;
  display: grid;
  grid-template-columns: 240px auto;
  column-gap: 20px;
  padding: 20px;
  margin: auto 20px;

  background: rgba(66, 66, 66, 0.3);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 26.0498px 50.1px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(45px);

  border-radius: 20px;

  animation: fadein 0.4s;

  @media (max-width: 650px) {
    grid-template-columns: auto;
    grid-template-rows: min-content auto;
    justify-items: center;
    gap: 20px;
    width: auto;
    height: 520px;
    gap: 0px;
    height: 800px;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ResumeeCardWrapper = styled.div`
  display: contents;
  /* @media (max-width: 650px) {
    display: none;
  } */
`

const ResumeeCardCollapsedWrapper = styled.div`
  display: none;
  position: relative;
  @media (max-width: 650px) {
    display: contents;
  }
`

const WorkWrapper = styled.div`
  height: 350px;
  padding: 20px 10px;


  @media (max-width: 650px) {
    width: auto;
    height: 480px;
  }

`

const Title = styled.div`
  font-style: normal;
  font-size: 13px;
  line-height: 130%;
  color: ${themes.light.text2};
  font-weight: 600;
  text-transform: uppercase;
  margin: 0px;

  @media (prefers-color-scheme: dark) {
    color: ${themes.dark.text2};
  }
`

const ListWrapper = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 12px;
  height: 100%;
  overflow-y: scroll;
  mask-image: linear-gradient(
    rgb(255, 255, 255) 80%,
    rgba(255, 255, 255, 0) 100%
  );


  ::-webkit-scrollbar {
    display: none;
  }
`
