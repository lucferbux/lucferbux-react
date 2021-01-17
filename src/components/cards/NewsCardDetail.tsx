import React, { useEffect } from "react"
import styled from "styled-components"
import { News } from "../../data/model/news"
import { Caption, H2, H3, MediumText } from "../styles/TextStyles"
import NewsCard from "./NewsCard"
import NewsCardCollapsed from "./NewsCardCollapsed"

interface NewsCardDetailProps {
  news: News
  inverted?: Boolean
}

const NewsCardDetail = (props: NewsCardDetailProps) => {
  const { news, inverted } = props

  return (
    <Wrapper inverted={inverted ? inverted : false}>
      <NewsCardWrapper>
        <NewsCard news={news} />
      </NewsCardWrapper>
      <NewsCardCollapsedWrapper>
        <NewsCardCollapsed news={news} />
      </NewsCardCollapsedWrapper>

      <TextWrapper>
        <Text>{news.description_en}</Text>
      </TextWrapper>
    </Wrapper>
  )
}

export default NewsCardDetail

const Text = styled(Caption)`
  font-size: 18px;
  line-height: 130%;
  color: #ffffff;
  mix-blend-mode: normal;
  opacity: 0.8;
  text-align: left;
  direction: ltr;

`
interface WrapperProps {
  inverted: Boolean
}

const Wrapper = styled.div<WrapperProps>`
  width: 586px;
  height: 400px;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 26.0498px 50.1px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(44.8399px);
  border-radius: 20px;
  direction: ${props => (props.inverted ? "rtl" : "ltr")};

  ${Text} {
  }

  @media (max-width: 650px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;
    justify-items: center;
    gap: 20px;
    width: auto;
    height: 520px;
  }
`

const NewsCardWrapper = styled.div`

  display: contents;
  @media (max-width: 650px) {
    display: none;
  }

`

const NewsCardCollapsedWrapper = styled.div`
  display: none;
  position: relative;
  @media (max-width: 650px) {
    display: contents;
  }
`

const TextWrapper = styled.div`
  overflow-y: scroll;
  width: 287px;
  height: 360px;
  white-space: pre-line;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 650px) {
    width: auto;
    height: auto;
  }
`


