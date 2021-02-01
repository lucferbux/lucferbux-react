import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import InConstructionSection from "../components/home/InConstruction"
import PostSection from "../components/posts/PostSection"

const Posts = () => {
  return (
    <Layout>
      <SEO title="Posts" meta={[]}/>
      <PostSection />
    </Layout>
  )
}

export default Posts;
