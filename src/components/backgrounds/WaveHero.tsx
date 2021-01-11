import React from "react"
import styled from "styled-components"

const WaveHero = () => {
  return (
    <Wrapper>
      <Background />
      <Wave
        src="/images/waves/hero-wave1.svg"
        alt="Background Image"
        style={{ top: "100px" }}
      />
      <BackgroundBlur />
      <Wave2
        src="/images/waves/hero-wave2.svg"
        alt="Background Image"
        style={{ top: "350px" }}
      />
      <BottomWave src="/images/waves/hero-wave3.svg" alt="Background Image" style={{ top: "550px" }} />
      <WaveStars/>
    </Wrapper>
  )
}

export default WaveHero

const Wrapper = styled.div`
  position: relative;
`

const WaveStars = styled.div`
  position: absolute;
  width: 100%;
  background-position: center top;
  background-repeat: repeat;
  background-image: url("/images/backgrounds/stars.svg");
  height: 224px;
  top: 10px;
  display: none;

  @media (prefers-color-scheme: dark) {
    display: block;
  }
`

const Wave = styled.img`
  position: absolute;
  z-index: -1;
  @media (min-width: 1440px) {
    width: 100%;
  }
`

const BackgroundBlur = styled.div`
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 800px;
  backdrop-filter: blur(60px);
`

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 800px;
  background: linear-gradient(180deg, #c98c31 0%, #eabe7d 100%);
  z-index: -10;
`
const Wave2 = styled(Wave)`
  z-index: 0;

`

const BottomWave = styled(Wave)`
  z-index: 0;
  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/hero-wave3-dark.svg");
  }
`
