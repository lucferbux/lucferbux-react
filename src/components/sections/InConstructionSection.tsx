import React, { useEffect } from "react"
import styled from "styled-components"
import { H1 } from "../styles/TextStyles"
import { themes } from "../styles/ColorStyles"
import WaveInConstruction from "../backgrounds/WaveInConstruction"
import FlatButton from "../buttons/FlatButton"

interface InConstructionProps {
  icon: string;
  text: string; 
  link: string;
}


const InConstructionSection = (props: InConstructionProps) => {
  useEffect(() => {})

  const { icon, text, link } = props

  return (
    <Wrapper>
      <Background />
      <WaveInConstruction />
      <WaveStars />
      <ContentWrapper>
        <TextWrapper>
          <Title>In construction</Title>
          <ButtonWrapper>
            <FlatButton icon={icon} text={text} link={link} />
          </ButtonWrapper>
        </TextWrapper>
      </ContentWrapper>
    </Wrapper>
  )
}

export default InConstructionSection

const Wrapper = styled.div`
  overflow: hidden;
  height: 2000px;
`

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const WaveStars = styled.div`
  position: absolute;
  width: 100%;
  background-position: center top;
  background-repeat: repeat;
  background-image: url("/images/backgrounds/stars.svg");
  height: 500px;
  top: 0px;
  display: none;

  @media (prefers-color-scheme: dark) {
    display: block;
  }
`

const Background = styled.div`
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 1200px;
  background: linear-gradient(
    189.16deg,
    rgb(0, 119, 137) 13.57%,
    rgb(176, 196, 199) 98.38%
  );

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
    189.16deg,
    rgb(43, 40, 48) 13.57%,
    rgb(40, 119, 137) 98.38%
  );
  }
`

const ContentWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 200px 30px;
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  justify-content: center;
  

  @media (max-width: 450px) {
    grid-template-columns: auto;
    padding: 150px 20px 250px;
    gap: 60px;
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
