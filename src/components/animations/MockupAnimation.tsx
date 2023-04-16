import React from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

const MockupAnimation = () => {
  const data = useStaticQuery(queryProfile);

  return (
    <Wrapper>
      <GatsbyImage
        image={data.profile.childImageSharp.gatsbyImageData}
        className="profile"
        alt="Profile Image Header" />
      <GatsbyImage
        image={data.bulb.childImageSharp.gatsbyImageData}
        className="bulb"
        alt="Bulb Image Header" />
      <GatsbyImage
        image={data.headphones.childImageSharp.gatsbyImageData}
        className="headphones"
        alt="Headphone Image Header" />
      <GatsbyImage
        image={data.folder.childImageSharp.gatsbyImageData}
        className="folder"
        alt="Folder Image Header" />
      <GatsbyImage
        image={data.turntable.childImageSharp.gatsbyImageData}
        className="turntable"
        alt="Turntable Image Header" />
      <GatsbyImage
        image={data.gamepad.childImageSharp.gatsbyImageData}
        className="gamepad"
        alt="Gamepad Image Header" />
      <GatsbyImage
        image={data.computer.childImageSharp.gatsbyImageData}
        className="computer"
        alt="Computer Image Header" />
    </Wrapper>
  );
}

export default MockupAnimation


const queryProfile = graphql`query MyQuery {
  profile: file(relativePath: {eq: "animation/profile.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
  turntable: file(relativePath: {eq: "animation/turntable.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
  bulb: file(relativePath: {eq: "animation/bulb.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
  headphones: file(relativePath: {eq: "animation/headphones.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
  folder: file(relativePath: {eq: "animation/folder.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
  gamepad: file(relativePath: {eq: "animation/gamepad.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
  computer: file(relativePath: {eq: "animation/computer.png"}) {
    childImageSharp {
      gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
    }
  }
}`

const Wrapper = styled.div`
  position: relative;

  @media (max-width: 1160px) {
    transform: scale(0.8) translateY(30px);
    transform-origin: top right;
  }

  @media (max-width: 970px) {
    transform: scale(0.7) translateY(50px);
    transform-origin: top right;
  }

  @media (max-width: 948px) {
    transform: scale(0.6) translateY(90px);
    transform-origin: top right;
  }

  @media (max-width: 870px) {
    transform: scale(0.5) translateX(-50px) translateY(190px);
  }

  @media (max-width: 800px) {
    transform: scale(0.45) translateX(-50px) translateY(220px);
  }

  @media (max-width: 750px) {
    transform: scale(0.45) translateX(-50px) translateY(90px);
  }

  @media (max-width: 450px) {
    transform: scale(0.4) translateX(-60px) translateY(90px);
  }

  @media (max-width: 370px) {
    transform: scale(0.35) translateX(-20px) translateY(100px);
  }

  .profile {
    position: absolute !important;
    width: 301px;
    height: 660px;
    right: 220px;
    top: -120px;

    animation: float-profile 4s linear infinite;
  }

  @keyframes float-profile {
    0% {
      transform: translate(0px, 0px);
    }
    25% {
      transform: translate(0px, 10px);
    }

    50% {
      transform: translate(0px, 0px);
    }
    75% {
      transform: translate(0px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .bulb {
    position: absolute !important;
    width: 89px;
    height: 89px;
    right: 620px;
    top: -80px;
    animation: float-bulb 4s ease-out infinite;
  }

  @keyframes float-bulb {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(10px, 10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .headphones {
    position: absolute !important;
    width: 89px;
    height: 89px;
    right: 650px;
    top: 120px;
    animation: float-headphones 4s ease-out infinite;
  }

  @keyframes float-headphones {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(10px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .folder {
    position: absolute !important;
    width: 114px;
    height: 114px;
    right: 610px;
    top: 320px;
    animation: float-folder 4s ease-out infinite;
  }

  @keyframes float-folder {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(10px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .turntable {
    position: absolute !important;
    width: 100px;
    height: 76px;
    right: 70px;
    top: -70px;
    animation: float-turntable 4s ease-out infinite;
  }

  @keyframes float-turntable {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(-10px, 10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .gamepad {
    position: absolute !important;
    width: 81px;
    height: 81px;
    right: 25px;
    top: 125px;
    animation: float-gamepad 4s ease-out infinite;
  }

  @keyframes float-gamepad {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(-10px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .computer {
    position: absolute !important;
    width: 108px;
    height: 108px;
    right: 60px;
    top: 320px;
    animation: float-computer 4s ease-out infinite;
  }

  @keyframes float-computer {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(-10px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }
`
