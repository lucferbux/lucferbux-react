import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { News } from "../../data/model/news"
import { themes } from "../styles/ColorStyles"
import { Caption, H2, H3, MediumText } from "../styles/TextStyles"

interface NewsCardCollapsedCollapsedProps {
  news: News
}

const NewsCardCollapsed = (props: NewsCardCollapsedCollapsedProps) => {
  const { news } = props

  const [load, setLoaded] = useState(false);

  const loadImage = () => {
    setLoaded(true);
  }

  return (
    <Wrapper href={news.url} target="_blank" rel="noopener">
      <CardWrapper>
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
      </CardWrapper>
      
    </Wrapper>
  )
}

export default NewsCardCollapsed

const CardTitle = styled(MediumText)`
  position: absolute;
  left: 0px;
  bottom: 20px;
  margin: 0px 20px;
  direction: ltr;
  font-size: 20px;
  line-height: 16px;
  font-weight: 600;
  word-break: break-word;
  z-index: 3;
  color: ${themes.light.text1};

  @media (prefers-color-scheme: dark) {
      color: ${themes.dark.text1};
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
  position: relative;
  height: fit-content;
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
  cursor: pointer;
  :hover {
    transform: scale(1.05);
  }

  :active {
    transform: scale(1.02);
  }
`

const CardWrapper = styled.div`
  position: relative;
  align-items: center;
  min-width: 200px;
  height: auto;
  color: ${themes.light.text1};

  &:after {
    content: "";
    position: absolute;
    left: 0px;
    top: 0px;
    border-radius: 12px;
    width: 100%;
    height: 100%;

    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(208, 208, 208) 110%
    ); 

    @media (prefers-color-scheme: dark) {
      color: ${themes.dark.text1};
      background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(6, 5, 1) 110%
    ); 
    }
  }
`
