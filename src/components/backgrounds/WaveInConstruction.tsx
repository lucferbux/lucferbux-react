import React from "react"
import styled from "styled-components"

const WaveInConstruction = () => {
  return (
    <WaveWrapper>
      <Wrapper>
        <Wave />
        <BottomWave />
        <svg>
          <clipPath id="clip">
            <path>
              <animate
                repeatCount="indefinite"
                fill="freeze"
                attributeName="d"
                dur="40s"
                values="M1228.1 62.9026C1015.3 -18.9903 1005.12 -4.07699 783.138 14.9026C561.156 33.8822 492.527 81.4487 327.138 62.9026C161.75 44.3565 74.1221 67.9803 -5.00049 87.7609C-5.00049 175.694 -5.00073 584 -5.00073 584L1517.1 584L1517.1 62.9025C1517.1 62.9025 1441.29 144.945 1228.1 62.9026Z;
            
            M1188.5 22.4999C975.698 -59.393 874.483 112.02 652.5 131C430.517 149.98 344.888 81.408 179.5 62.8619C14.1119 44.3158 10.9245 174.47 -68.198 194.251C-68.198 282.183 -68.198 617 -68.198 617L1507.99 617L1507.99 92.0507C1507.99 92.0507 1401.69 104.543 1188.5 22.4999Z;
            
            M1191.5 30.0509C816.152 95.2231 828.5 1.97022e-06 624 1.96953e-06C419.5 1.96885e-06 366 42 208 103.5C50 165 10.9245 112.47 -68.198 132.251C-68.198 220.183 -68.198 555 -68.198 555L1507.99 555L1507.99 30.0509C1507.99 30.0509 1474 -19 1191.5 30.0509Z;

            M1228.1 62.9026C1015.3 -18.9903 1005.12 -4.07699 783.138 14.9026C561.156 33.8822 492.527 81.4487 327.138 62.9026C161.75 44.3565 74.1221 67.9803 -5.00049 87.7609C-5.00049 175.694 -5.00073 584 -5.00073 584L1517.1 584L1517.1 62.9025C1517.1 62.9025 1441.29 144.945 1228.1 62.9026Z
            "
              />
            </path>
          </clipPath>
        </svg>
        
      </Wrapper>
    </WaveWrapper>
  )
}

export default WaveInConstruction

const WaveWrapper = styled.div`
  position: relative;
  top: 200px;
`

const Wrapper = styled.div`
  position: absolute;
  height: 1500px;
  width: 100%;
  overflow: hidden;
  animation: 1s ease 0s 1 normal forwards running jBcSpD;

  svg {
    position: absolute;
    width: 100%;
  }
`



const Wave = styled.div`
  position: absolute;
  width: 100%;
  top: 0px;
  background: url("/images/waves/courses-wave1.svg");
  height: 800px;
  z-index: -1;
  display: none;

  @media (min-width: 1440px) {
    background-size: 3000px;
    background-position: 30% 0px;
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
