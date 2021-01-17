import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { menuData } from "../../data/menuData"
import { number } from "prop-types"

const Header = () => {
  return (
    <Wrapper>
      <Link to="/">
        <img src="/images/logos/logo.svg" alt={"Logo Icon"} />
      </Link>

      <MenuWrapper count={menuData.length}>
        {menuData.map((item, index) => (
          <Link to={item.link} key={index}>
            <MenuItem>
              <img className="icon-item" src={item.icon} alt={item.title} />
              <TitleItem>{item.title}</TitleItem>
            </MenuItem>
          </Link>
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

const MenuItem = styled.div`
  color: rgba(255, 255, 255, 0.7);
  display: grid;
  grid-template-columns: 24px auto;
  gap: 10px;
  align-items: center;
  padding: 10px;

  border-radius: 10px;
  transition: 0.5s ease-out;

  @media (max-width: 450px) {
    display: block;
  }

  :hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1),
      inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2);
  }

  .icon-item {
    @media (max-width: 450px) {
      width: 30px;
      height: 30px;
    }
  }
`

const TitleItem = styled.div`
  @media (max-width: 450px) {
    display: none;
  }
`
