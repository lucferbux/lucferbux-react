import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import PostSection from "../components/posts/PostSection"

const Posts = () => {
  return (
    <Layout>
      <SEO title="Posts" themeColor="#007789" themeColorDark="#2b2830" meta={[]}/>
      <PostSection />
    </Layout>
  )
}

export default Posts;
