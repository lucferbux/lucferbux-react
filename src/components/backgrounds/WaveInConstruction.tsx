import React from "react"
import styled from "styled-components"

const WaveInConstruction = () => {
  return (
    <WaveWrapper>
      <Wrapper>
        <Background />
        <BottomWave src="/images/waves/hero-wave3.svg" alt="Background Image" style={{ top: "400px" }} />
      </Wrapper>
    </WaveWrapper>
  )
}

export default WaveInConstruction


const Background = styled.div`
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 800px;
  background: linear-gradient(
    180.00deg,
    rgb(0, 119, 137) 13.57%,
    rgb(176, 196, 199) 98.38%
  );

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
    180.00deg,
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

// const BottomWave = styled.div`
//   position: absolute;
//   width: 100%;
//   z-index: -1;
//   clip-path: url(#clip);
//   transform-origin: left top;
//   background: linear-gradient(
//     rgb(188, 198, 246) -18.72%,
//     rgb(242, 246, 255) 37.6%
//   );
//   top: 450px;
//   height: 100%;

//   @media (min-width: 1440px) {
//     transform: scale(2);
//     left: -1px;
//   }

//   @media (prefers-color-scheme: dark) {
//     background: linear-gradient(rgb(74, 77, 94) -18.72%, rgb(43, 40, 48) 37.6%);
//   }
// `

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