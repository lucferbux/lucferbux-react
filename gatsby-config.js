module.exports = {
  siteMetadata: {
    title: `Lucferbux`,
    description: `Lucferbux Personal Webpage`,
    author: `@lucferbux`,
    url: `https://lucferbux.dev`,
    image: `static/images/logos/logo.svg`,
    twitterUsername: "@lucferbux",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static/images`,
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Lucferbux Web`,
        short_name: `Lucferbux`,
        start_url: `/`,
        background_color: `#F2F6FF`,
        theme_color: `#EABE7D`,
        display: `standalone`,
        description: `Personal PWA`,
        icon: `static/images/logos/logo.svg`
      }
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },
    `gatsby-plugin-typescript`
  ],
}
