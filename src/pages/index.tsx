import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import HeroSection from "../components/home/HeroSection"
import styled from "styled-components"
import NewsSection from "../components/home/NewsSectionHome"


function IndexPage() {
  return (
      <Layout>
        <SEO title="Home" />
        <HeroSection />
        <NewsSection/>
        <Padding />
      </Layout>
  )
}

export default IndexPage

const Padding = styled.div`
  height: 1200px;
`
