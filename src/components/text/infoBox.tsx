import React from "react"
import { string } from "prop-types"
import styled from "styled-components"
import FlatButtonLink from "../buttons/FlatButtonLink"
import { H1, H2, H3, MediumText } from "../styles/TextStyles"
import { themes } from "../styles/ColorStyles"

interface InfoBoxProps {
  title: string;
  description: string;
  darkColor?: Boolean;
  displayButton: Boolean;
  iconButton?: string;
  textButton?: string;
  linkButton?: string;
}

const InfoBox = (props: InfoBoxProps) => {
  return (
    <InfoWrapper>
      <Title dark={props.darkColor ? props.darkColor : false}>{props.title}</Title>
      <Description dark={props.darkColor ? props.darkColor : false}>
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
  height: fit-content;
  @media (max-width: 650px) {
    text-align: center;
    gap: 10px;
  }
`
interface TextProps {
  dark: Boolean;
}

const Title = styled(H2)<TextProps>`
  color: ${props => props.dark ? themes.light.text1 : themes.dark.text1};

  @media (prefers-color-scheme: dark) {
    color: ${themes.dark.text1};
  }
`

const Description = styled(MediumText)<TextProps>`
  color: ${props => props.dark ? themes.light.text2 : themes.dark.text2};

  @media (prefers-color-scheme: dark) {
    color: ${themes.dark.text2};
  }
`

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: start;
  
  @media (max-width: 1000px) {
    justify-content: center;
    margin-bottom: 40px;
  }

`
