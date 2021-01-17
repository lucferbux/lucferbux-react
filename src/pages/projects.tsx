import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import InConstructionSection from "../components/home/InConstruction"

const Projects = () => {
  return (
    <Layout>
      <SEO title="Projects" meta={[]}/>
      <InConstructionSection icon="code" text="Old Web" link="https://lucferbux-web-page.web.app/projects"/>
    </Layout>
  )
}

export default Projects;
