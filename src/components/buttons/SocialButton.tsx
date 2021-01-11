import React from "react"
import styled from "styled-components"


interface SocialButton {
  icon: string;
  link: string;
}


const  SocialButton = (props: SocialButton) => 
{
  const { icon, link } = props

  return (
      <Wrapper href={link} target="_blank" rel="noopener">
        <IconWrapper>
            <Icon src={`/images/icons/${icon}.svg`} className="icon" alt="Logo Social Button"/>
            <Ring src="/images/icons/icon-ring.svg" alt="Decorative Ring"/>
        </IconWrapper>
      </Wrapper>
  )
}

export default SocialButton;

const Icon = styled.img`
    width: 29px;
    height: 29px;
`


const Wrapper = styled.a`
  max-width: 78px;
  height: 78px;
  padding: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #FFFBD9 100%);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1),
    0px 20px 40px rgba(102, 61, 0, 0.2),
    inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  border: 0px;
  display: grid;
  grid-template-columns: 53px;
  justify-content: center;
  align-items: center;
  *, & {
    transition: 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  :hover {
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1),
                0px 30px 60px rgba(102, 61, 0, 0.5),
                inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);

    .icon {
      transform: scale(1.2);
    }
  }

  :active {
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1),
                0px 25px 50px rgba(102, 61, 0, 0.3),
                inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);

    .icon {
      transform: scale(1.1);
    }
  }
`

const IconWrapper = styled.div`
    width: 45px;
    height: 45px;
    background: linear-gradient(200.44deg, #c98c31 13.57%, #eabe7d 98.38%);
    border-radius: 50%;
    display: grid;
    justify-content: center;
    align-content: center;
    position: relative;
    margin-left: 4px;

    ${Wrapper}:hover & {
      filter: hue-rotate(18deg);
    }

    ${Wrapper}:active & {
      filter: hue-rotate(3deg);
    }
`


const Ring = styled.img`
    position: absolute;
    top: -5px;
    left: -5px;

    ${Wrapper}:hover & {
      transform: rotate(30deg) scale(1.2);
    }

    ${Wrapper}:active & {
      transform: rotate(10deg) scale(1.1);
    }
`