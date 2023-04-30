import React, { useEffect } from "react"
import styled from "styled-components"
import WaveBody from "../backgrounds/WaveBody"
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
  useEffect(() => {

    console.log(news?.data);
  })

  const newsCollection = useFirestore()
    .collection("intro")
    .orderBy("timestamp", "desc")

  const news: ObservableStatus<Array<News>> = useFirestoreCollectionData(
    newsCollection
  )

  return (
    <Wrapper>
      <WaveBody />
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
  height: auto;
`

const ContentWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 150px 30px 30px 30px;
  display: grid;
  grid-template-columns: 360px auto;

  @media(max-width: 1000px) {
      grid-template-columns: auto;
      justify-items: center;
      text-align: center;
  }

  @media(max-width: 650px) {
      grid-template-columns: auto;
      justify-items: center;
      padding: 120px 30px 10px 30px;
  }
`

const NewsWrapper = styled.div`
  max-width: 1234px;
  min-height: 1000px;
  margin: 0 auto;
  padding: 20px 30px 80px 30px;
  display: grid;
  grid-template-columns: auto auto;
  gap: 40px;

  @media(max-width: 1020px) {
    grid-template-columns: auto;
    justify-items: center;
  }

  @media(max-width: 650px) {
    gap: 26px;
  }

  
`