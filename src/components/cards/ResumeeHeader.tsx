import { graphql, useStaticQuery } from "gatsby";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ExternalLink } from "../../data/model/externalLink";
import { GatsbyImage } from "gatsby-plugin-image";
import { BodyIntro, SmallText } from "../styles/TextStyles";
import ResumeeButton from "../buttons/ResumeeButon";

interface ResumeeHeaderProps {
  title: string;
  caption: string;
  description: string;
  buttons: Array<ExternalLink>
}

const ResumeeHeader = (props: ResumeeHeaderProps) => {
  const { title, caption, description, buttons } = props;

  const dataQuery = useStaticQuery(queryAvatar);

  return (
    <Wrapper>
      <ContentWrapper>
        <GatsbyImage
          image={dataQuery.avatar.childImageSharp.gatsbyImageData}
          className="resumee-avatar"
          alt="Profile Avatar" />
        <Name>{title}</Name>
        <Caption>{caption}</Caption>
        <Description>{description}</Description>
      </ContentWrapper>
      <ButtonWrapper count={buttons.length} >
        {buttons.map((button, index) => (
          <ResumeeButton icon={button.image} link={button.link} key={index} />
        ))}
      </ButtonWrapper>
    </Wrapper>
  );
}

export default ResumeeHeader;

const queryAvatar = graphql`query AvatarQuery {
  avatar: file(relativePath: {eq: "avatars/avatar-lucas.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
}
`

const Wrapper = styled.div`
  position: relative;
  width: 240px;
  height: 360px;
  background: linear-gradient(200.42deg, #EABE7D 13.57%, #C98C31 98.35%);
  border-radius: 10px;
  padding-top: 60px;
  cursor: pointer;

  @media (max-width: 650px) {
    width: 100%;
    height: 280px;
    padding: 16px;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(200.44deg, #E3B877 13.57%, #906421 98.38%);
  }
`

const ContentWrapper = styled.div`
    display: grid;
    gap: 10px;
    width: 200px;
    margin: 0px auto;
    text-align: center;

    .resumee-avatar {
      width: 88px;
      height: 88px;
      margin: 0px auto;
      border-radius: 50px;
    }
`

const Name = styled(BodyIntro)`
  font-style: normal;
  font-size: 24px;
  color: rgb(255, 255, 255);
  font-weight: bold;
  line-height: 29px;
  margin: 0px;
`

const Caption = styled(SmallText)`
    font-style: normal;
    font-size: 13px;
    line-height: 130%;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
    margin: 0px;
    text-transform: uppercase;
`

const Description = styled(SmallText)`
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 130%;
    color: rgba(255, 255, 255, 0.7);
    margin: 0px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

interface ButtonWrapperProps {
  count: number;
}

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.count}, auto);
  column-gap: 24px;
  justify-content: center;
  justify-items: center;
  margin: 20px auto;
`