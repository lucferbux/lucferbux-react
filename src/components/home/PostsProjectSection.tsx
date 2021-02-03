import React, { useContext, useEffect } from "react"
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire"
import "firebase/firestore"
import styled from "styled-components"
import { News } from "../../data/model/news"
import WaveNewsHome from "../backgrounds/WaveNewsHome"
import NewsCard from "../cards/NewsCard"
import NewsCardDetail from "../cards/NewsCardDetail"
import InfoBox from "../text/infoBox"
import { Post } from "../../data/model/post"
import { Project } from "../../data/model/project"
import ProjectCard from "../cards/ProjectCard"
import WavePostHome from "../backgrounds/WavePostHome"
import PostCard from "../cards/PostCard"

const infoProject = {
  title: "Recent Projects",
  description:
    "These are a few of my latests projects I’ve been working on. Some of them are propietary, so there’s no source code.",
  iconButton: "code",
  textButton: "Browse projects",
  linkButton: "projects",
}

const infoPosts = {
  title: "Tech Posts",
  description:
    "Personal posts and collaborations talking about multiple fields of Technology such as Development, Security, AI...",
  iconButton: "vector",
  textButton: "Browse posts",
  linkButton: "posts",
}

const PostProjectSection = () => {
  const projectCollection = useFirestore()
    .collection("project")
    .orderBy("date", "desc")
    .limit(2)

  const project: ObservableStatus<Array<Project>> = useFirestoreCollectionData(
    projectCollection
  )

  const postCollection = useFirestore()
    .collection("patent")
    .orderBy("date", "desc")
    .limit(1)

  const post: ObservableStatus<Array<Post>> = useFirestoreCollectionData(
    postCollection
  )

  return (
    <Wrapper>
      <WavePostHome />
      <Wave5 src="/images/waves/postproject-wave5.svg" alt="Background Image" />

      <ProjectCardDeatilWrapper>
        <TextWrapper>
          <InfoBox
            title={infoProject.title}
            description={infoProject.description}
            displayButton={true}
            darkColor={true}
            iconButton={infoProject.iconButton}
            textButton={infoProject.textButton}
            linkButton={infoProject.linkButton}
          />
        </TextWrapper>
        <ProjectCardWrapper>
          {project?.data?.map((projectEntry, index) => (
            <ProjectCard
              project={projectEntry}
              captionText={"FEATURED"}
              key={index}
            />
          ))}
        </ProjectCardWrapper>
      </ProjectCardDeatilWrapper>

      <PostCardDeatilWrapper>
        <TextWrapperInverted>
          <InfoBox
            title={infoPosts.title}
            description={infoPosts.description}
            displayButton={true}
            darkColor={true}
            iconButton={infoPosts.iconButton}
            textButton={infoPosts.textButton}
            linkButton={infoPosts.linkButton}
          />
        </TextWrapperInverted>
        <PostCardWrapper>
          {post?.data?.map((postEntry, index) => (
            <PostCard post={postEntry} key={index} />
          ))}
        </PostCardWrapper>
      </PostCardDeatilWrapper>
    </Wrapper>
  )
}

export default PostProjectSection

const Wave5 = styled.img`
  position: absolute;
  display: none;
  z-index: -1;
  bottom: -10px;

  @media (min-width: 1440px) {
    width: 100%;
    display: block;
  }

  @media (prefers-color-scheme: dark) {
    content: url("/images/waves/postproject-wave5-dark.svg");
    display: none;

    @media (min-width: 3340px) {
      width: 100%;
      display: block;
      bottom: -400px;
    }
  }
`

const Wrapper = styled.div`
  position: relative;
  padding-top: 5px;
  height: 1220px;
  overflow: hidden;

  @media (max-width: 1000px) {
    height: 1420px;
  }
`

const ProjectCardDeatilWrapper = styled.div`
  max-width: 1234px;
  margin: 100px auto 20px auto;
  padding: 20px 30px;
  display: grid;
  grid-template-columns: 360px auto;
  justify-content: space-between;

  @media (max-width: 1000px) {
    display: block;
    padding: 20px 0px;
    text-align: center;
    margin: 120px auto 20px auto;
  }

  @media (min-width: 1000px) {
    padding: 40px 30px;
  }

  @media (min-width: 1950px) {
    padding: 60px 30px;
  }

  @media (min-width: 2600px) {
    padding: 80px 30px;
  }
`

const ProjectCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 280px);
  justify-items: center;
  gap: 30px;
  max-width: 1234px;
  padding: 40px 20px;
  position: relative;
  top: -40px;

  @media (max-width: 1000px) {
    grid-template-columns: auto auto;
    overflow-x: scroll;
    justify-items: center;
    padding-bottom: 150px;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 640px) {
    justify-content: flex-start;
  }
`

const PostCardDeatilWrapper = styled.div`
  max-width: 1234px;
  padding: 20px 30px;
  margin: auto;
  display: grid;
  grid-template-columns: 360px auto;
  justify-content: space-between;
  direction: rtl;

  @media (max-width: 1000px) {
    display: block;
    padding: 20px 0px;
    text-align: center;
    top: -150px;
    position: relative;
  }

  @media (min-width: 1000px) {
    padding: 40px 30px;
  }
`

const PostCardWrapper = styled.div`
  display: grid;
  grid-template-columns: auto;
  justify-items: center;
  position: relative;
  direction: ltr;
  padding: 0px 20px;
`

const TextWrapper = styled.div`
  @media (max-width: 1000px) {
    display: grid;
    justify-items: center;
  }
`

const TextWrapperInverted = styled(TextWrapper)`
  direction: ltr;
  padding: 0px 20px;
`
