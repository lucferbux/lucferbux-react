import React from "react"
import styled from "styled-components"

const WaveFooter = () => {
  return (
    <Wrapper>
      <Background />
      <Wave alt="Background wave 1"/>
      <Wave2 alt="Background wave 2"/>

    </Wrapper>
  )
}

export default WaveFooter

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  overflow: hidden;
  top: 0px;
  height: 600px;
`

const Wave = styled.img`
  position: absolute;
  top: 100px;
  width: 100%;
  z-index: -1;
  overflow: hidden;
  content: url("/images/waves/footer-wave1.svg");
`

const Wave2 = styled(Wave)`
  z-index: -2;
  transform: scale(1.2);
  top: 70px;
  left: 40px;
  content: url("/images/waves/footer-wave2.svg");
  @media (max-width: 450px) {
    transform: scale(1);
    top: 80px;
    left: 0px;
  }

  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/footer-wave2-dark.svg");
  }
`

const Background = styled.div`
  position: absolute;
  top: 200px;
  background: #1B2E2D;
  width: 100%;
  height: 900px;

  @media (min-width: 1440px) {
    top: 600px;
  }
`
