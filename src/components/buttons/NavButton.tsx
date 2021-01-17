import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import { Caption } from "../styles/TextStyles"

interface NavButtonProps {
  icon: string
  text: string
  link: string
  collapse?: boolean
}

const NavButton = (props: NavButtonProps) => {
  const { icon, text, link, collapse } = props

  return (
    <Link to={link}>
      <MenuItem displayText={collapse ? collapse : false}>
        <img className="icon-item" src={icon} alt={text} />
        <TitleItem displayText={collapse ? collapse : false}>{text}</TitleItem>
      </MenuItem>
    </Link>
  )
}

export default NavButton

interface MenuItemProps {
  displayText: Boolean;
}


const MenuItem = styled.div<MenuItemProps>`
  color: rgba(255, 255, 255, 0.7);
  display: grid;
  grid-template-columns: 24px auto;
  gap: 10px;
  align-items: center;
  padding: 10px;

  border-radius: 10px;
  transition: 0.5s ease-out;

  @media (max-width: 450px) {
    display: ${props => props.displayText ? "block" : "grid"};
  }

  :hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1),
      inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2);
  }

  .icon-item {
    @media (max-width: 450px) {
      width: ${props => props.displayText ? "30px" : "auto"};
      height: ${props => props.displayText ? "30px" : "auto"};
    }
  }
`

interface TitleItemProps {
  displayText: Boolean;
}


const TitleItem = styled.div<TitleItemProps>`
  @media (max-width: 450px) {
    display: ${props => props.displayText ? "none" : "block"};
  }
`
