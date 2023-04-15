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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content`,
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
        theme_color: `#CA8F36`,
        theme_color_in_head: false,
        display: `standalone`,
        description: `Personal PWA`,
        icon: `static/images/logos/logo.svg`,
        icon_options: {
          purpose: `any maskable`,
        },
        prefer_related_applications: true,
        related_applications: [
          {
            platform: "play",
            id: "com.lucferbux.lucferbux"
          }
        ]
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/`,
      },
    },
  ],
}
