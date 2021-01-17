import React, { useEffect } from "react"
import styled from "styled-components"
import { H1 } from "../styles/TextStyles"
import { themes } from "../styles/ColorStyles"
import WaveInConstruction from "../backgrounds/WaveInConstruction"
import "firebase/firestore";
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire"
import { News } from "../../data/model/news"
import InfoBox from "../text/infoBox"
import NewsCardDetail from "../cards/NewsCardDetail"

const info = {
  title: "Latest News",
  description: "Here are the latest news related to my professional work",
}

const NewsSection = () => {
  useEffect(() => {})

  const newsCollection = useFirestore()
    .collection("intro")
    .orderBy("timestamp", "desc")

  const news: ObservableStatus<Array<News>> = useFirestoreCollectionData(
    newsCollection
  )

  return (
    <Wrapper>
      <WaveInConstruction />
      <WaveStars />
      <ContentWrapper>
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={false}
        />
      </ContentWrapper>
      <NewsWrapper>
        {news?.data?.map((newsEntry, index) => (
          <NewsCardDetail news={newsEntry} inverted={index % 2 == 0} key={index}/>
        ))}
      </NewsWrapper>
    </Wrapper>
  )
}

export default NewsSection

const Wrapper = styled.div`
  overflow: hidden;
  height: auto;
`

const WaveStars = styled.div`
  position: absolute;
  width: 100%;
  background-position: center top;
  background-repeat: repeat;
  background-image: url("/images/backgrounds/stars.svg");
  height: 420px;
  top: 0px;
  display: none;

  @media (prefers-color-scheme: dark) {
    display: block;
  }
`

const ContentWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 150px 30px 30px 30px;
  display: grid;
  grid-template-columns: 360px auto;

  @media(max-width: 650px) {
      grid-template-columns: auto;
      justify-items: center;
      padding: 150px 30px 0px 30px;
  }
`

const NewsWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 20px 30px 80px 30px;
  display: grid;
  grid-template-columns: auto auto;
  gap: 40px;

  @media(max-width: 1200px) {
    grid-template-columns: auto;
    justify-items: center;
  }

  @media(max-width: 650px) {
    gap: 26px;
  }
`

const TextWrapper = styled.div`
  max-width: 600px;
  display: grid;
  gap: 30px;
  align-items: center;
  z-index: 1;
`

const Title = styled(H1)`
  color: ${themes.dark.text1};

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
