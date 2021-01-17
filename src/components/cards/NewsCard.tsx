import React, { useEffect } from "react"
import styled from "styled-components"
import { News } from "../../data/model/news"
import { Caption, H2, H3, MediumText } from "../styles/TextStyles"

interface NewsCardProps {
  news: News
}

const NewsCard = (props: NewsCardProps) => {
  const { news } = props

  const handleClick = () => {
    window.location.href = news.url;
  }

  return (
    <Wrapper href={news.url} target="_blank" rel="noopener">
      <CardWrapper>
        <HeaderImage src={news.image} />
        <CardTitle>{news.title_en}</CardTitle>
        <CardDate>{new Date(news.timestamp.seconds * 1000).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</CardDate>
      </CardWrapper>
    </Wrapper>
  )
}

export default NewsCard

const CardDate = styled(Caption)`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin: 10px 0px 0px;
`

const CardTitle = styled(MediumText)`
  font-size: 24px;
  line-height: 29px;
  font-weight: 600;
  color: #ffffff;
  word-break: break-word;

  @media (max-width: 414px) {
    font-size: 18px;
  }
`

const HeaderImage = styled.img`
  width: 100%;
  margin: 0px;
  -webkit-animation: 1s ease 0s 1 normal forwards running jBcSpD;
  animation: 1s ease 0s 1 normal forwards running jBcSpD;
  border-radius: 12px;
`

const Wrapper = styled.a`
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
  cursor: pointer;
  :hover {
    transform: scale(1.1);
  }

  :active {
    transform: scale(1.05);
  }
  max-width: 260px;
`

interface CardWrapperProps {
  isRow: Boolean
}

const CardWrapper = styled.div<CardWrapperProps>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 2fr auto;
  gap: 30px;
  align-items: center;
  min-width: 200px;
  max-width: 260px;
  height: 360px;
  border-radius: 20px;
  text-align: center;
  background: linear-gradient(200.44deg, #EABE7D 13.57%, #C98C31 98.38%);
  box-shadow: rgb(78 153 227 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px;
  padding: 8px;

  @media (max-width: 414px) {
    height: 330px;
  }

  @media (prefers-color-scheme) {
    box-shadow: rgb(11 58 105 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px;
  }
`
