import React from "react"
import { string } from "prop-types"
import styled from "styled-components"
import FlatButtonLink from "../buttons/FlatButtonLink"
import { H3, MediumText } from "../styles/TextStyles"
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
      <Title>Latest News</Title>
      <Description>
        Here are the latest news related to my professional work
      </Description>
      {props.displayButton && (
        <ButtonWrapper>
          <FlatButtonLink icon="courses" text="Browse news" link="news" />
        </ButtonWrapper>
      )}
    </InfoWrapper>
  )
}

export default InfoBox

const InfoWrapper = styled.div`
  max-width: 360px;
  display: grid;
  gap: 30px;
  @media (max-width: 1000px) {
    text-align: center;
  }
`

const Title = styled(H3)`
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
