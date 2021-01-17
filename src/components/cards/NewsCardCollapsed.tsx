import React, { useEffect } from "react"
import styled from "styled-components"
import { News } from "../../data/model/news"
import { Caption, H2, H3, MediumText } from "../styles/TextStyles"

interface NewsCardCollapsedCollapsedProps {
  news: News
}

const NewsCardCollapsed = (props: NewsCardCollapsedCollapsedProps) => {
  const { news } = props

  return (
    <Wrapper href={news.url} target="_blank" rel="noopener">
      <CardWrapper>
        <HeaderImage src={news.image} />
      </CardWrapper>
      <CardTitle>{news.title_en}</CardTitle>
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
  color: #ffffff;
  word-break: break-word;
`

const HeaderImage = styled.img`
  width: 100%;
  margin: 0px;
  -webkit-animation: 1s ease 0s 1 normal forwards running jBcSpD;
  animation: 1s ease 0s 1 normal forwards running jBcSpD;
  border-radius: 12px;
`

const Wrapper = styled.a`
  position: relative;
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
  &:after {
    content: "";
    position: absolute;
    left: 0px;
    top: -2px;
    border-radius: 12px;
    width: 100%;
    height: 100%;
    background: -moz-linear-gradient(
      top,
      rgba(0, 0, 0, 0) 0%,
      rgba(72, 58, 6) 110%
    ); /* FF3.6+ */
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, rgba(72, 58, 6)),
      color-stop(110%, rgba(0, 0, 0, 0))
    ); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(
      top,
      rgba(0, 0, 0, 0) 0%,
      rgba(72, 58, 6) 110%
    ); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(
      top,
      rgba(0, 0, 0, 0) 0%,
      rgba(72, 58, 6) 110%
    ); /* Opera 11.10+ */
    background: -ms-linear-gradient(
      top,
      rgba(0, 0, 0, 0) 0%,
      rgba(72, 58, 6) 110%
    ); /* IE10+ */
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(72, 58, 6) 110%
    ); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
  }
`
