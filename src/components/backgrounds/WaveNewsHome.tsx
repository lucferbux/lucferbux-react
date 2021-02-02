import React from "react"
import styled from "styled-components"

const WaveNewsHome = () => {
  return (
    <Wrapper> 
      <Wave
        src="/images/waves/course-wave1.svg"
        alt="Background Image"
        style={{ top: "0px" }}
      />
      <Wave2
        src="/images/waves/course-wave2.svg"
        alt="Background Image"
      />
    </Wrapper>
  )
}

export default WaveNewsHome

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

const Wave2 = styled(Wave)`
  z-index: 0;
  top: 350px;

  @media (min-width: 1560px) {
    top: 420px;
  }

  @media (min-width: 1850px) {
    top: 490px;
  }

  @media (min-width: 2100px) {
    top: 420px;
  }

  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/course-wave2-dark.svg");
  }

`

