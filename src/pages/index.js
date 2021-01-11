import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import HeroSection from "../components/sections/HeroSection"
import styled from "styled-components"

function IndexPage() {
  return (
    <Layout>
      <SEO title="Home" />
      <HeroSection></HeroSection>
      <Padding/>
    </Layout>
  )
}

export default IndexPage


const Padding = styled.div`
  height: 1200px;
  
`
