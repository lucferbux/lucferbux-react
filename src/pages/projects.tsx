import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import InConstructionSection from "../components/sections/InConstructionSection"

const Projects = () => {
  return (
    <Layout>
      <SEO title="Projects" meta={[]}/>
      <InConstructionSection/>
    </Layout>
  )
}

export default Projects;
