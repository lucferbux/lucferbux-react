import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import { themes } from "../styles/ColorStyles"
import { Caption } from "../styles/TextStyles"

interface FlatButtonLinkProps {
  icon: string
  text: string
  link: string
}

const FlatButtonLink = (props: FlatButtonLinkProps) => {
  const { icon, text, link } = props

  return (
    <Link to={link}>
      <Wrapper>
        <Icon
          src={`/images/icons/${icon}.svg`}
          className="icon"
          alt="Logo Social Button"
        />
        <Title>{text}</Title>
      </Wrapper>
    </Link>
  )
}

export default FlatButtonLink

const Icon = styled.img``

const Title = styled(Caption)`
  margin: auto auto auto 8px;
  color: ${themes.dark.text1};
`

const Wrapper = styled.button`
  display: flex;
  background: linear-gradient(
    180deg,
    rgba(141, 141, 145, 0.6) 0%,
    rgba(129, 129, 129, 0.45) 100%
  );
  box-shadow: rgba(0, 0, 0, 0.15) 0px 20px 40px,
    rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset;
  border-radius: 30px;
  border: none;
  padding: 10px 30px 10px 12px;
  cursor: pointer;

  *,
  & {
    transition: 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  :hover {
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 20px 40px,
      rgba(0, 0, 0, 0.3) 0px 0px 0px 0.5px inset,
      rgba(0, 0, 0, 0.3) 0px 10px 40px inset;

    .icon {
      transform: scale(1.1);
    }
  }
`
