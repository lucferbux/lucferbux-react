import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import InConstructionSection from "../components/sections/InConstructionSection"

const Posts = () => {
  return (
    <Layout>
      <SEO title="Posts" meta={[]}/>
      <InConstructionSection icon="vector" text="Old Web" link="https://lucferbux.dev/posts"/>
    </Layout>
  )
}

export default Posts;
