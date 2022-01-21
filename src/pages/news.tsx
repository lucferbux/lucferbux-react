import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import NewsSection from "../components/news/NewsSection"



const News = () => {
  return (
    <Layout>
      <SEO title="News" themeColor="#007789" themeColorDark="#2b2830" meta={[]}/>
      <NewsSection />
    </Layout>
  )
}

export default News;
