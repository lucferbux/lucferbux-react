import React, { useContext, useEffect } from "react";
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
import "firebase/firestore";
import styled from "styled-components";
import { News } from "../../data/model/news";
import WaveNewsHome from "../backgrounds/WaveNewsHome";
import NewsCard from "../cards/NewsCard";
import NewsCardDetail from "../cards/NewsCardDetail";
import InfoBox from "../text/infoBox";

const info = {
  title: "Latest News",
  description: "Here are the latest news related to my professional work",
  iconButton: "courses",
  textButton: "Browse news",
  linkButton: "news"
}

const NewsSection = () => {

  const newsCollection = useFirestore()
    .collection("intro")
    .orderBy("timestamp", "desc")
    .limit(6)
  const news: ObservableStatus<Array<News>> = useFirestoreCollectionData(
    newsCollection
  )

  return (
    <Wrapper>
      <WaveNewsHome />

      <CardDeatilWrapper>
      <InfoBox title={info.title} description={info.description} displayButton={true}
       iconButton={info.iconButton} textButton={info.textButton} linkButton={info.linkButton} />
        {news?.data && (
          <NewsCardDetail news={news?.data?.[0]} inverted={true} />
        )}
      </CardDeatilWrapper>

      <CardWrapper>
        {news?.data?.slice(1, 6).map((newsEntry, index) => (
          <NewsCard news={newsEntry} key={index} />
        ))}
      </CardWrapper>
    </Wrapper>
  )
}

export default NewsSection;


const CardDeatilWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  max-width: 1234px;
  margin: 40px auto;
  padding: 20px 30px;

  @media (max-width: 1000px) {
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: 650px) {
    height: 770px;
  }
`

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 218px);
  justify-items: center;
  gap: 20px;
  max-width: 1234px;
  margin: 40px auto;
  padding: 40px 30px;
  position: relative;
  top: -40px;

  @media (max-width: 650px) {
    top: -60px;
  }

  @media (max-width: 500px) {
    padding: 40px 20px;
  }

  @media (max-width: 1234px) {
    grid-template-columns: repeat(5, minmax(200px, 1fr));
    padding-bottom: 120px;
    overflow-x: scroll;

    ::-webkit-scrollbar {
      display: none;
    }
  }
`

const Wrapper = styled.div`
  position: relative;
  padding-top: 5px;
  height: 1362px;
  overflow: hidden;
`
