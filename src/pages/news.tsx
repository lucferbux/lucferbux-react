import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"

const News = () => {
  return (
    <Layout>
      <SEO title="News" meta={[]}/>
      <h1>In construction...</h1>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default News;
