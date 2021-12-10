import React from "react"
import styled from "styled-components"

const WaveTerms = () => {
  return (
    <WaveWrapper>
      <Wrapper>
        <Background />
      </Wrapper>
    </WaveWrapper>
  )
}

export default WaveTerms


const Background = styled.div`
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 130px;
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

const WaveWrapper = styled.div`
  position: relative;
`

const Wrapper = styled.div`
  position: absolute;
  height: 1500px;
  width: 100%;
  overflow: hidden;
  animation: 1s ease 0s 1 normal forwards running jBcSpD;

  svg {

  }
`


const BottomWave = styled.img`
  position: absolute;
  z-index: -1;
  @media (min-width: 1440px) {
    width: 100%;
  }
  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/hero-wave3-dark.svg");
  }
`