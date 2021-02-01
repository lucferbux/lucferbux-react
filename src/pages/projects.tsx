import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import ProjectSection from "../components/projects/ProjectSection"

const Projects = () => {
  return (
    <Layout>
      <SEO title="Projects" meta={[]}/>
      <ProjectSection />
    </Layout>
  )
}

export default Projects;
