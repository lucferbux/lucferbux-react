import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Post } from "../../data/model/post"
import { H3, MediumText } from "../styles/TextStyles"

interface PostCardCollapsedCollapsedProps {
  post: Post
}

const PostCard = (props: PostCardCollapsedCollapsedProps) => {
  const { post } = props

  const [load, setLoaded] = useState(false);

  const loadImage = () => {
    setLoaded(true);
  }

  return (
    <Wrapper href={post.link} target="_blank" rel="noopener">
      <CardWrapper>
        <HeaderImageWrapper>
          <HeaderImage
            src={post.image}
            alt={"News Header Image"}
            onLoad={loadImage}
            visible={load}
          />

          <HeaderImage
            src={"/images/animations/loading.gif"}
            alt={"News Header Image"}
            visible={!load}
          />
        </HeaderImageWrapper>
        <CardTitle>{post.title_en}</CardTitle>
        <CardDescription>{post.description_en}</CardDescription>
      </CardWrapper>
      
    </Wrapper>
  )
}

export default PostCard

const CardTitle = styled(H3)`
  position: absolute;
  left: 0px;
  top: 30px;
  margin: 0px 20px;
  word-break: break-word;
  z-index: 3;

  @media(max-width: 520px) {
    top: 20px;
    font-size: 20px;
 }
`

const CardDescription = styled(MediumText)`
  position: absolute;
  left: 0px;
  bottom: 30px;
  margin: 0px 20px;
  word-break: break-word;
  z-index: 3;
  @media(max-width: 520px) {
    font-size: 12px;
    bottom: 20px;
    max-height: 80px;
    overflow-y: scroll;
 }
 ::-webkit-scrollbar {
      display: none;
    }
`

const HeaderImageWrapper = styled.div`
  width: 100%;
  margin: 0px;
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
`

interface HeaderImageProps {
  visible: Boolean
}

const HeaderImage = styled.img<HeaderImageProps>`
  width: 100%;
  margin: 0px;
  border-radius: 12px;
  display: ${props => (props.visible ? "block" : "none")};
  filter: blur(4px);
`

const Wrapper = styled.a`
  position: relative;
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
  cursor: pointer;
  :hover {
    transform: scale(1.05);
  }

  :active {
    transform: scale(1.02);
  }
`

const CardWrapper = styled.div`
  position: relative;
  color: #ffffff;
  align-items: center;
  min-width: 200px;
  max-width: 500px;
  overflow: hidden;
  border-radius: 12px;
  height: auto;
  animation: fadein 0.4s;
  box-shadow: rgb(24 32 79 / 25%) 0px 40px 80px;

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  &:after {
    content: "";
    position: absolute;
    left: 0px;
    top: 0px;
    border-radius: 12px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    box-shadow: rgb(255 255 255 / 50%) 0px 0px 0px 1px inset;
  }
`
