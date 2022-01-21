import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import PostSection from "../components/posts/PostSection"
import TermsSection from "../components/terms/termsSection"

const Terms = () => {
  return (
    <Layout>
      <SEO title="Terms" themeColor="#007789" themeColorDark="#2b2830" meta={[]}/>
      <TermsSection/>
    </Layout>
  )
}

export default Terms;
