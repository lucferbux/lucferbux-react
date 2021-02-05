import React from "react"
import styled from "styled-components"
import WaveFooter from "../backgrounds/WaveFooter"
import { footerData } from "../../data/footerData"
import NavButton from "../buttons/NavButton"
import NavButtonExternal from "../buttons/NavButtonExternal"

const Footer = () => {
  return (
    <Wrapper>
      <WaveFooter />
      <ContentWrapper>
        <LinkWrapper>
          {footerData.map((item, index) => {
            return item.external ? (
              <NavButtonExternal
                icon={item.icon}
                text={item.title}
                link={item.link}
                key={index}
              />
            ) : (
              <NavButton
                icon={item.icon}
                text={item.title}
                link={item.link}
                key={index}
              />
            )
          })}
        </LinkWrapper>
        <FooterText>
          <p>This site does not track any information about usage</p>
        </FooterText>
      </ContentWrapper>
    </Wrapper>
  )
}

export default Footer

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 440px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding-top: 250px;

  @media (max-width: 550px) {
    top: 10px;
  }
`

const LinkWrapper = styled.div`
  display: grid;
  max-width: 340px;
  grid-template-columns: 144px 144px;
  gap: 0px;
  column-gap: 8px;
`

const FooterText = styled.div`
  max-width: 280px;
  height: 110px;
  color: rgba(255, 255, 255, 0.7);
  padding: 64px 0px;
  font-size: 13px;

  @media (max-width: 600px) {
    text-align: center;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  max-width: 660px;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 40px;
  margin: 0px auto;
  padding: 0px 20px;
  box-sizing: border-box;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`
