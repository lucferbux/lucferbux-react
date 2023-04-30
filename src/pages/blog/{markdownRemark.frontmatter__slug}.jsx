import * as React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { H1, Caption } from "../../components/styles/TextStyles"
import { themes } from "../../components/styles/ColorStyles"
import Layout from "../../components/layout/layout"
import SEO from "../../components/layout/seo"
import "./blog.css"
import "./prism.css"
import WaveBody from "../../components/backgrounds/WaveBody"

export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  return (
    <Layout>
      <SEO
        title="Blog"
        themeColor="#007789"
        themeColorDark="#2b2830"
        meta={[]}
      />
      <Wrapper>
        <WaveBody />
        <ContentWrapper>
          <Title className="title-blog">{frontmatter.title}</Title>
          <Date>{frontmatter.date}</Date>
          <BlogImg src={frontmatter.featuredImage} alt={"Blog Header Image"} />
          <Description dangerouslySetInnerHTML={{ __html: html }} />
        </ContentWrapper>
      </Wrapper>
    </Layout>
  )
}

const Wrapper = styled.div`
  overflow: hidden;
  @media (min-width: 2500px) {
    padding-bottom: 100px;
  }
`

const BlogImg = styled.img`
  width: 100%;
  margin: 30px 0px;
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 140px 30px 30px 30px;

  @media (max-width: 750px) {
    padding: 150px 20px 20px 20px;
    gap: 60px;
  }
`

const Title = styled(H1)`
  color: ${themes.dark.text1};
  margin: 30px 0px 10px 0px;
`

const Date = styled(Caption)`
  color: ${themes.dark.text1};
`
const Description = styled.div`
  color: ${themes.light.text1};

  @media (prefers-color-scheme: dark) {
    color: ${themes.dark.text1};
  }
`

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        featuredImage
      }
    }
  }
`
