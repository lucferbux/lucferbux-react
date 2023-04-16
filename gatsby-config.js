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
    `gatsby-plugin-image`,
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-classes`,
            options: {
              classMap: {
                "heading[depth=1]": "title-blog",
                "heading[depth=2]": "subtitle-blog",
                "heading[depth=3]": "emphasis-title-blog",
                paragraph: "paragraph-blog",
                link: "link-blog",
                "list[ordered=false]": "list-blog-unordered",
                "list[ordered=true]": "list-blog-ordered",
                image: "image-container-blog",
                strong: "strong-blog"
              }
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (e.g. <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (e.g. for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
            },
          },
          {
            resolve:"gatsby-remark-codepen",
            options: {
              theme: "dark",
              height: 400
            }
          }
        ]
      }
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
