import React from "react"
import styled from "styled-components"

const WaveInConstruction = () => {
  return (
    <WaveWrapper>
      <Wrapper>
        <Background />
        <BottomWave />
        <svg
        width="1440"
        height="595"
        viewBox="0 0 1440 595"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="clip">
          <path
            d="M1228.1 33.4482C1015.3 -48.4447 894.983 44.5668 673 63.5464C451.017 82.526 492.527 51.9944 327.139 33.4483C161.751 14.9022 74.123 38.5259 -4.99951 58.3066C-4.99951 146.239 -4.99975 516.857 -4.99975 516.857L1517.1 516.857L1517.1 33.4481C1517.1 33.4481 1441.29 115.491 1228.1 33.4482Z"
            fill="white"
          />
        </clipPath>
      </svg>
        
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

const BottomWave = styled.div`
  position: absolute;
  width: 100%;
  z-index: -1;
  clip-path: url(#clip);
  transform-origin: left top;
  background: linear-gradient(
    rgb(188, 198, 246) -18.72%,
    rgb(242, 246, 255) 37.6%
  );
  top: 450px;
  height: 900px;

  @media (min-width: 1440px) {
    transform: scale(2);
    left: -1px;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(rgb(74, 77, 94) -18.72%, rgb(43, 40, 48) 37.6%);
  }
`
