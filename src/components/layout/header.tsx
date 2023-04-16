import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { menuData } from "../../data/menuData"
import NavButton from "../buttons/NavButton"

const Header = () => {
  return (
    <Wrapper>
      <Link to="/">
        <img src="/images/logos/logo.svg" alt={"Logo Icon"} />
      </Link>

      <MenuWrapper count={menuData.length}>
        {menuData.map((item, index) => (
          <NavButton icon={item.icon} text={item.title} link={item.link} key={index} collapse={true}/>
        ))}
      </MenuWrapper>
    </Wrapper>
  )
}

export default Header

const Wrapper = styled.div`
  position: absolute;
    display: flex;
    justify-content: space-between;
    max-width: 1234px;
    height: 44px;
    left: 0px;
    right: 0px;
    margin: 0px auto;
    padding: 40px 30px;
    z-index: 3;


  @media (max-width: 550px) {
    top: 10px;
    padding: 20px;
  }
`

interface MenuWrapperProps {
  count: number;
}

const MenuWrapper = styled.div<MenuWrapperProps>`
  display: grid;
  grid-template-columns: repeat(${props => props.count}, auto);
  gap: 30px;
  
`


