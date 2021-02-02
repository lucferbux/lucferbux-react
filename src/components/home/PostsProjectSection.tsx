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

  return (
    <Wrapper>
      <WavePostHome />

      <CardDeatilWrapper>
        <TextWrapper>
          <InfoBox
            title={infoProject.title}
            description={infoProject.description}
            displayButton={true}
            iconButton={infoProject.iconButton}
            textButton={infoProject.textButton}
            linkButton={infoProject.linkButton}
          />
        </TextWrapper>

        <ProjectCardWrapper>
          {project?.data?.map((projectEntry, index) => (
            <ProjectCard project={projectEntry} captionText={"FEATURED"} key={index} />
          ))}
        </ProjectCardWrapper>
      </CardDeatilWrapper>
    </Wrapper>
  )
}

export default PostProjectSection

const CardDeatilWrapper = styled.div`
  max-width: 1234px;
  margin: 100px auto;
  padding: 20px 30px;
  display: grid;
  grid-template-columns: 360px auto;
  justify-content: space-between;

  @media (max-width: 1000px) {
    /* grid-template-columns:  auto;
    justify-items: center;
    justify-content: center;
    text-align: center; */
    display: block;
    padding: 20px 0px;
    text-align: center;
  }

  @media (min-width: 1000px) {
    padding: 40px 30px;
  }

`

const TextWrapper = styled.div`
  @media (max-width: 1000px) {
    display: grid;
    justify-items: center;
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
    padding-bottom: 120px;
    overflow-x: scroll;
    justify-items: center;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 640px) {
    justify-content: flex-start;

  }


`

const Wrapper = styled.div`
  position: relative;
  padding-top: 5px;
  height: 1362px;
  overflow: hidden;
`
