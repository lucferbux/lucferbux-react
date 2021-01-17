import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import InConstructionSection from "../components/sections/InConstructionSection"

const News = () => {
  return (
    <Layout>
      <SEO title="News" meta={[]}/>
      <InConstructionSection icon="courses" text="Old Web" link="https://lucferbux.dev/news"/>
    </Layout>
  )
}

export default News;
