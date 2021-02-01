import React from "react"
import { string } from "prop-types"
import styled from "styled-components"
import FlatButtonLink from "../buttons/FlatButtonLink"
import { H1, H2, H3, MediumText } from "../styles/TextStyles"
import { themes } from "../styles/ColorStyles"

interface InfoBoxProps {
  title: string;
  description: string;
  displayButton: Boolean;
  iconButton?: string;
  textButton?: string;
  linkButton?: string;
  blackText?: Boolean;
}

const InfoBox = (props: InfoBoxProps) => {
  return (
    <InfoWrapper>
      <Title>{props.title}</Title>
      <Description>
        {props.description}
      </Description>
      {props.displayButton && (
        <ButtonWrapper>
          <FlatButtonLink 
            icon={props.iconButton ? props.iconButton : "news"} 
            text={props.textButton ? props.textButton : "News"} 
            link={props.linkButton ? props.linkButton : "news"}  />
        </ButtonWrapper>
      )}
    </InfoWrapper>
  )
}

export default InfoBox

const InfoWrapper = styled.div`
  max-width: 360px;
  display: grid;
  gap: 20px;
  color: ${themes.dark.text1};
  @media (max-width: 650px) {
    text-align: center;
    gap: 10px;
  }
`

const Title = styled(H2)`
  color: ${themes.dark.text1};
`

const Description = styled(MediumText)`
  color: ${themes.dark.text2};
`

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: start;
  @media (max-width: 1000px) {
    justify-content: center;
    margin-bottom: 40px;
  }
  @media (max-width: 650px) {
    margin-bottom: 0px;
  }
`
