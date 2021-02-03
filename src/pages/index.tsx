import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import HeroSection from "../components/home/HeroSection"
import styled from "styled-components"
import NewsSection from "../components/home/NewsSectionHome"
import PostProjectSection from "../components/home/PostsProjectSection"
import AboutMeSection from "../components/home/AboutMeSection"


function IndexPage() {
  return (
      <Layout>
        <SEO title="Home" />
        <HeroSection />
        <NewsSection/>
        <PostProjectSection/>
        <AboutMeSection/>
        <Padding />
      </Layout>
  )
}

export default IndexPage

const Padding = styled.div`
  height: 200px;
`
