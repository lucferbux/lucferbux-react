import React from "react"
import styled from "styled-components"

const WaveBackground = () => {
  return (
    <Wrapper>
      <Background />
      <Wave
        src="/images/waves/hero-wave1.svg"
        alt="Background Image"
        style={{ top: "100px", filter: `blur(60px)` }}
      />
      <Wave src="/images/waves/hero-wave2.svg" alt="Background Image" style={{ top: "350px" }} />
      <BottomWave src="/images/waves/hero-wave3.svg" alt="Background Image" style={{ top: "550px" }} />
    </Wrapper>
  )
}

export default WaveBackground

const Wrapper = styled.div`
  position: relative;
`

const Wave = styled.img`
  position: absolute;
  z-index: -1;
  @media (min-width: 1440px) {
    width: 100%;
  }
`

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 800px;
  background: linear-gradient(180deg, #c98c31 0%, #eabe7d 100%);
  z-index: -1;
`
const BottomWave = styled(Wave)`
  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/hero-wave3-dark.svg");
  }
`
