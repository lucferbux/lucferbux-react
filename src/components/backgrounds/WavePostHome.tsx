import React from "react"
import styled from "styled-components"

const WavePostHome = () => {
  return (
    <Wrapper> 
      <Wave
        src="/images/waves/postproject-wave1.svg"
        alt="Background Image"
      />
      <Wave2
        src="/images/waves/postproject-wave2.svg"
        alt="Background Image"
        
      />
      <Wave3
        src="/images/waves/postproject-wave3.svg"
        alt="Background Image"
        
      />
      <Wave4
        src="/images/waves/postproject-wave4.svg"
        alt="Background Image"
       
      />
      <Lines
        src="/images/waves/postproject-lines.svg"
        alt="Background Image"
      />

    </Wrapper>
  )
}

export default WavePostHome;

const Wrapper = styled.div`
  position: relative;
`

const Lines = styled.img`
  z-index: -1;
  position: absolute;
  top: 210px;
  @media (min-width: 1440px) {
    width: 100%;
  }
`


const Wave = styled.img`
  position: absolute;
  z-index: -4;
  @media (min-width: 1440px) {
    width: 100%;
  }
`

const Wave2 = styled(Wave)`
  z-index: -3;
  top: 69px;
`

const Wave3 = styled(Wave)`
  z-index: -2;
  top: 210px;

  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/postproject-wave3-dark.svg");
  }

`

const Wave4 = styled(Wave)`
  z-index: -1;
  top: 328px;

  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/postproject-wave4-dark.svg");
  }

`

