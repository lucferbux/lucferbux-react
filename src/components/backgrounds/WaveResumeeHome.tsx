import React from "react"
import styled from "styled-components"

const WaveResumeeHome = () => {
  return (
    <Wrapper> 
      <Wave
        src="/images/waves/resumee-wave1.svg"
        alt="Background Image"
      />
      <Wave2
        src="/images/waves/resumee-wave2.svg"
        alt="Background Image"
        
      />
      <Wave3
        src="/images/waves/resumee-wave3.svg"
        alt="Background Image"
        
      />
      <Wave4
        src="/images/waves/resumee-wave4.svg"
        alt="Background Image"
       
      />

      <Wave5
        src="/images/waves/resumee-wave5.svg"
        alt="Background Image"
       
      />

      <Wave6
        src="/images/waves/resumee-wave6.svg"
        alt="Background Image"
       
      />
      
    </Wrapper>
  )
}

export default WaveResumeeHome;

const Wrapper = styled.div`
  position: relative;
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
  top: 230px;
`

const Wave3 = styled(Wave)`
  z-index: -2;
  top: 300px;

`

const Wave4 = styled(Wave)`
  z-index: -1;
  top: 190px;

`

const Wave5 = styled(Wave)`
  z-index: -1;
  top: 464px;

`

const Wave6 = styled(Wave)`
  z-index: -1;
  top: 770px;
  display: block;

  @media (min-width: 1500px) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/resumee-wave6-dark.svg");
  }

`



