import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import ProjectSection from "../components/projects/ProjectSection"

const Projects = () => {
  return (
    <Layout>
      <SEO title="Projects" themeColor="#007789" themeColorDark="#2b2830" meta={[]}/>
      <ProjectSection />
    </Layout>
  )
}

export default Projects;
