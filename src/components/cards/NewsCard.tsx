import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { News } from "../../data/model/news"
import { Caption, H2, H3, MediumText } from "../styles/TextStyles"

interface NewsCardProps {
  news: News
}

const NewsCard = (props: NewsCardProps) => {
  const { news } = props

  const [load, setLoaded] = useState(false);

  const loadImage = () => {
    setLoaded(true);
  }

  return (
    <Wrapper href={news.url} target="_blank" rel="noopener">
      <CardWrapper isRow={false}>
        <HeaderImageWrapper>
          <HeaderImage
            src={news.image}
            alt={"News Header Image"}
            onLoad={loadImage}
            visible={load}
          />

          <HeaderImage
            src={"/images/animations/loading.gif"}
            alt={"News Header Image"}
            visible={!load}
          />
        </HeaderImageWrapper>
        <CardTitle>{news.title_en}</CardTitle>
        <CardDate>
          {new Date(news.timestamp.seconds * 1000).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDate>
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
  direction: ltr;
`

const CardTitle = styled(MediumText)`
  font-size: 24px;
  line-height: 29px;
  font-weight: 600;
  color: #ffffff;
  word-break: break-word;

  @media (max-width: 470px) {
    font-size: 18px;
  }
`

const HeaderImageWrapper = styled.div`
  width: 100%;
  margin: 0px;
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
`

interface HeaderImageProps {
  visible: Boolean
}

const HeaderImage = styled.img<HeaderImageProps>`
  width: 100%;
  margin: 0px;
  border-radius: 12px;
  display: ${props => (props.visible ? "block" : "none")};
`

const Wrapper = styled.a`
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
  cursor: pointer;
  :hover {
    transform: scale(1.1);
    ${HeaderImageWrapper} {
      transform: scale(0.95);
    }
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
  background: linear-gradient(200.44deg, #eabe7d 13.57%, #c98c31 98.38%);
  box-shadow: rgb(78 153 227 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px;
  padding: 8px;

  @media (max-width: 414px) {
    height: 330px;
  }

  @media (prefers-color-scheme) {
    box-shadow: rgb(11 58 105 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px;
  }
`
