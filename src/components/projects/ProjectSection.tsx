import React, { useEffect } from "react"
import styled from "styled-components"
import WaveBody from "../backgrounds/WaveBody"
import "firebase/firestore";
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire"
import InfoBox from "../text/infoBox"
import { Project } from "../../data/model/project"
import ProjectCard from "../cards/ProjectCard"

const info = {
  title: "Explore Projects",
  description: "These are a few of my latests projects I've been working on. Some of them are propieatry, so there's no source code",
}

const ProjectSection = () => {
  useEffect(() => {})

  const projectCollection = useFirestore()
    .collection("project")
    .orderBy("date", "desc")

  const projects: ObservableStatus<Array<Project>> = useFirestoreCollectionData(
    projectCollection
  )

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
      <ProjectWrapper>
        {projects?.data?.map((projectEntry, index) => (
          <ProjectCard project={projectEntry}  key={index}/> 
        ))}
      </ProjectWrapper>
    </Wrapper>
  )
}

export default ProjectSection

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
      padding: 120px 30px 0px 30px;
  }
`

const ProjectWrapper = styled.div`
  max-width: 1234px;
  min-height: 1000px;
  margin: 0 auto;
  padding: 20px 30px 120px 30px;
  display: grid;
  grid-template-columns: auto auto auto auto;  
  gap: 40px;

  @media(max-width: 1440px) {
    justify-items: center;
    grid-template-columns: auto auto auto;
  }

  @media(max-width: 990px) {
    
    grid-template-columns: auto auto;
    gap: 26px;
  }

  @media(max-width: 650px) {
    grid-template-columns: auto;
  }
`