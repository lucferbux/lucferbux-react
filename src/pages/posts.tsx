import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import InConstructionSection from "../components/home/InConstruction"

const Posts = () => {
  return (
    <Layout>
      <SEO title="Posts" meta={[]}/>
      <InConstructionSection icon="vector" text="Old Web" link="https://lucferbux-web-page.web.app/posts"/>
    </Layout>
  )
}

export default Posts;
