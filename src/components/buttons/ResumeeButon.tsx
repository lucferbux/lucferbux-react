import React from "react"
import styled from "styled-components"


interface ResumeeButton {
  icon: string;
  link: string;
}


const  ResumeeButton = (props: ResumeeButton) => 
{
  const { icon, link } = props

  return (
      <Wrapper href={link} target="_blank" rel="noopener">
        <Icon src={`/images/icons/${icon}.svg`} className="icon" alt="Logo Resumee Button"/>
      </Wrapper>
  )
}

export default ResumeeButton;

const Icon = styled.img`
    width: 28px;
    height: 28px;
    //background: rgba(0, 0, 0, 0.2);
    
    padding: 4px;
    cursor: pointer;
    border: none;
`


const Wrapper = styled.a`
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  display: grid;
  justify-content: center;
  align-content: center;
  
  *, & {
    transition: 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  :hover {
    transform: scale(1.2);
    background: rgba(0, 0, 0, 0.3);
  }

  :active {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.25);
  }
`

// const IconWrapper = styled.div`
//     width: 45px;
//     height: 45px;
//     background: linear-gradient(200.44deg, #c98c31 13.57%, #eabe7d 98.38%);
//     border-radius: 50%;
//     display: grid;
//     justify-content: center;
//     align-content: center;
//     position: relative;
//     margin-left: 4px;

//     ${Wrapper}:hover & {
//       filter: hue-rotate(18deg);
//     }

//     ${Wrapper}:active & {
//       filter: hue-rotate(3deg);
//     }
// `


// const Ring = styled.img`
//     position: absolute;
//     top: -5px;
//     left: -5px;

//     ${Wrapper}:hover & {
//       transform: rotate(30deg) scale(1.2);
//     }

//     ${Wrapper}:active & {
//       transform: rotate(10deg) scale(1.1);
//     }
// `