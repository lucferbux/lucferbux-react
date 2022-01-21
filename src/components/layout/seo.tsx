import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"


interface SEOProps {
  description?: string;
  lang?: string;
  meta?: any[];
  title: string;
  themeColor?: string;
  themeColorDark?: string;
}

const SEO: React.FC<SEOProps> = ({
  lang = `en`,
  meta = [],
  description = ``,
  ...props
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            url
            image
            twitterUsername
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description;
  const defaultTitle = site.siteMetadata?.title;
  const twitter = site.siteMetadata.twitterUsername;
  const image = site.siteMetadata.image;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={props.title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: props.title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: twitter || ``,
        },
        {
          name: `twitter:title`,
          content: props.title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'default'
        },
        {
          name: "theme-color",
          content: props.themeColor ?? "#CA8F36",
          media: "(prefers-color-scheme: light)"
        },
        {
          name: "theme-color",
          content: props.themeColorDark ?? "#9D7E50",
          media: "(prefers-color-scheme: dark)"
        }
        
      ].concat(meta)}
    />
  )
}





export default SEO
