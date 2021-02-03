import React, { useContext, useEffect } from "react";
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
import "firebase/firestore";
import styled from "styled-components";
import { News } from "../../data/model/news";
import WaveResumeeHome from "../backgrounds/WaveResumeeHome";
import NewsCard from "../cards/NewsCard";
import NewsCardDetail from "../cards/NewsCardDetail";
import InfoBox from "../text/infoBox";
import FlatButton from "../buttons/FlatButton";
import { H1, H3 } from "../styles/TextStyles";
import { themes } from "../styles/ColorStyles";

const info = {
  title: "My Resumée",
  description: "Here are the most important roles I’ve taken  so far",
}

const AboutMeSection = () => {

  const newsCollection = useFirestore()
    .collection("intro")
    .orderBy("timestamp", "desc")
    .limit(6)
  const news: ObservableStatus<Array<News>> = useFirestoreCollectionData(
    newsCollection
  )

  return (
    <Wrapper>
      <WaveResumeeHome />
      <WaveBottom src="/images/waves/resumee-wave6.svg" alt="Background Image" />

      <TextWrapper>
        <InfoBox title={info.title} description={info.description} displayButton={false} darkColor={false}/>
      </TextWrapper>

      <CardWrapper>
          <Title>In construction...</Title>
      </CardWrapper>
    </Wrapper>
  )
}

export default AboutMeSection;

const WaveBottom = styled.img`
  position: absolute;
  display: none;
  z-index: -1;
  bottom: -10px;

  @media (min-width: 1000px) {
    width: 100%;
    display: block;
  }

  @media (min-width: 2500px) {
    width: 100%;
    display: block;
    bottom: -280px;
  }

  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/resumee-wave6-dark.svg");
    /* display: none;

    @media (min-width: 3340px) {
      width: 100%;
      display: block;
      bottom: -400px;
    } */
  }
`


const TextWrapper = styled.div`
  display: grid;
  justify-items: center;
  max-width: 1234px;
  margin: 40px auto;
  padding: 120px 30px 20px 20px;
  text-align: center !important;
  @media (min-width: 1700px) {
    padding: 170px 30px 20px 20px;
  }

  @media (min-width: 2300px) {
    padding: 200px 30px 20px 20px;
  }
`

const CardWrapper = styled.div`
  display: grid;  
  justify-items: center;
`

const Wrapper = styled.div`
  position: relative;
  padding-top: 5px;
  height: 1400px;
  overflow: hidden;


  @media (max-width: 1000px) {
    height: 1400px;
  }
`


const Title = styled(H3)`
  color: ${themes.dark.text1};
`