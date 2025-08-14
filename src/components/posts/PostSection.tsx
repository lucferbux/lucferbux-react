import React, { useEffect } from "react"
import styled from "styled-components"
import { H1 } from "../styles/TextStyles"
import { themes } from "../styles/ColorStyles"
import WaveBody from "../backgrounds/WaveBody"
import "firebase/firestore"
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire"
import InfoBox from "../text/infoBox"
import { Post } from "../../data/model/post"
import PostCard from "../cards/PostCard"

const info = {
  title: "Tech Posts",
  description: "Personal posts and collaborations talking about multiple fields of Technology such as Development, Security, AI...",
}

const PostSection = () => {
  useEffect(() => {})

  const firestore = useFirestore();

  const postCollection = firestore
    .collection("patent")
    .orderBy("date", "desc");

  const posts = useFirestoreCollectionData(
    postCollection
  ) as ObservableStatus<Array<Post>>;

  return (
    <Wrapper>
      <WaveBody />
      <ContentWrapper>
        <InfoBox
          title={info.title}
          description={info.description}
          displayButton={false}
        />
      </ContentWrapper>
      <PostWrapper>
        {posts?.data?.map((postEntry, index) => (
          <PostCard post={postEntry} key={index}/>
        ))}
      </PostWrapper>
    </Wrapper>
  )
}

export default PostSection

const Wrapper = styled.div`
  height: auto;
`

const ContentWrapper = styled.div`
  max-width: 1234px;
  margin: 0 auto;
  padding: 150px 30px 30px 30px;
  display: grid;
  grid-template-columns: 360px auto;

  @media(max-width: 1000px) {
      grid-template-columns: auto;
      justify-items: center;
      text-align: center;
  }

  @media(max-width: 650px) {
      grid-template-columns: auto;
      justify-items: center;
      padding: 120px 30px 10px 30px;
  }
`

const PostWrapper = styled.div`
  max-width: 1234px;
  min-height: 1000px;
  margin: 0 auto;
  padding: 20px 30px 80px 30px;
  display: grid;
  grid-template-columns: auto auto;
  gap: 40px;

  @media(max-width: 1020px) {
    grid-template-columns: auto;
    justify-items: center;
  }

  @media(max-width: 650px) {
    gap: 26px;
  }
`