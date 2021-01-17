import React from "react"
import styled from "styled-components"
import { Caption } from "../styles/TextStyles"


interface NavButtonProps {
  icon: string;
  text: string; 
  link: string;
}


const  NavButton = (props: NavButtonProps) => 
{
  const { icon, text, link } = props

  return (
    <a href={link} target="_blank" rel="noopener">
      <Wrapper >
        <Icon src={`/images/icons/${icon}.svg`} className="icon" alt="Logo Social Button"/>
        <Title>{text}</Title>
      </Wrapper>
    </a>
      
  )
}

export default NavButton;

const Icon = styled.img`
    :hover {
      transform: scale(1.1);
    }
`

const Title = styled(Caption)`
  margin: auto auto auto 8px;
`



const Wrapper = styled.button`
  display: flex;
  background: linear-gradient(rgba(24, 32, 79, 0.4) 0%, rgba(24, 32, 79, 0.25) 100%);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 20px 40px, rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset;
  border-radius: 30px;
  border: none;
  padding: 10px 30px 10px 12px;
  cursor: pointer;


  *, & {
    transition: 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  :hover {
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 20px 40px, rgba(0, 0, 0, 0.3) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.3) 0px 10px 40px inset;
  }


  }
`

