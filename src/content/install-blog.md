---
slug: "/markdown-blog-gatsby"
date: "2023-04-23"
title: "Crear un blog en Gatsby con Markdown"
featuredImage: "https://user-images.githubusercontent.com/16117276/233856041-c9a85201-f17f-4402-8c57-a74e9fc6410c.png"
---
Hoy os voy a explicar como he creado una nueva sección en mi página web para renderizar blogs en formato `markdown`. El proceso es bastante sencillo, pero requiere un poco de configuración, lo voy a orientar a un nuevo proyecto, pero luego poniendo de ejemplos mis componentes y configuraciones, que contienen dependencias externas como [styled componentes](https://www.styled-components.com). Aquí os dejo los pasos:

## Instalar Gatsby y crear un nuevo proyecto

Lo primero de todo será instalar **Gatsby**, puedes seguir las indicaciones en [su página oficial](https://www.gatsbyjs.com/docs/tutorial/getting-started/part-0/), pero una versión reducida sería esta:

```bash
npm install -g gatsby-cli
gatsby new

------
What would you like to call your site?
✔ · Gatsby Blog
What would you like to name the folder where your site will be created?
✔ Blog/ gatsby-blog
✔ Will you be using JavaScript or TypeScript?
· TypeScript
✔ Will you be using a CMS?
· No (or I'll add it later)
✔ Would you like to install a styling system?
· No (or I'll add it later)
------


cd gatsby-blog
```

## Instalar complementos necesarios

Ahora tenemos que instalar los complementos necesarios para conseguir convertir los artículos en mardkown en html y dar el estilo y formato necesario.

```bash
npm install gatsby-transformer-remark gatsby-remark-classes gatsby-remark-codepen gatsby-remark-prismjs prismjs gatsby-source-filesystem
```

La funcionalidad de cada uno es la siguiente:

* **gatsby-transformer-remark**: Este plugin convierte archivos de markdown en HTML. Convierte los archivos .md en nodos procesables para que puedas consultar el contenido de tus archivos de markdown a través de GraphQL y mostrarlos en tus páginas de Gatsby.

* **gatsby-remark-classes**: Este plugin te permite asignar clases CSS personalizadas a elementos específicos generados a partir de archivos de markdown. Proporciona una manera fácil de aplicar estilos a elementos como encabezados, párrafos, listas y más, sin tener que añadir clases manualmente en cada elemento dentro del archivo de markdown.

* **gatsby-remark-codepen**: Este plugin te permite incrustar ejemplos de Codepen en tus publicaciones de blog de Gatsby. Simplemente proporciona la URL del Codepen y el plugin generará un iframe para mostrarlo en la página. Es útil para mostrar ejemplos interactivos de código en tus publicaciones.

* **gatsby-remark-prismjs**: Este plugin integra el resaltado de sintaxis de Prism.js en tus publicaciones de blog generadas a partir de archivos de markdown. Cuando incluyes bloques de código en tus archivos de markdown, este plugin aplicará automáticamente el resaltado de sintaxis de Prism.js.

**prismjs**: Prism.js es una biblioteca de resaltado de sintaxis para la web. Proporciona resaltado de sintaxis para una amplia variedad de lenguajes de programación y se integra fácilmente con proyectos de Gatsby a través del plugin gatsby-remark-prismjs.

* **gatsby-source-filesystem**: Este plugin crea nodos File a partir de archivos de tu sistema local. Permite a Gatsby leer archivos de tu sistema y hacer que el contenido esté disponible en tu sitio a través de GraphQL. Es fundamental para trabajar con archivos de markdown y otros tipos de archivos en tus proyectos de Gatsby.

### Configurar los complementos en gatsby-config.js

Ahora hay que agregar los plugins necesarios en la configuración de gatsby para que el framework pueda utilizar todas las dependencias en nuestro código

```javascript
import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Gatsby Blog`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
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
    }
  ],
}

export default config
```

## Crear la estructura de carpetas y archivos

Ahora hay que crear la estructura de carpetas para guardar los archivos, ahora explicaremos los archivos principales, hay que notar que `404.tsx` e `index.tsx` son autogenerados por gatsby.

```css
src
  ├── content
  │   └── sample-post.md
  └── pages
      ├── blog
      │   └── {markdownRemark.frontmatter__slug}.jsx
      │   └── blog.css
      │   └── prism.css
      └── 404.tsx
      └── index.tsx
```

## Crear el contenido de markdown

Como hemos visto en la parte de configuración, hemos indicado a gatsby que esté activamente vigilando la carpeta `content`, que es donde colocaremos nuestros ficheros en formato `markdown` para que `gatsby-transformer-remark` lo transforme en una página estática en html. Gracias a los distintos *plugins* podremos añadir imágenes, código y hasta [codepens](https://codepen.io) a nuestro post que **Gatsby** lo convertirá en contenido web sin problemas.

Lo más importante de estos posts es la cabecera que contendrá los metadatos para crear nuestros posts, estos atributos son los que luego extraeremos:

```markdown
---
slug: "/sample-post"
date: "2022-11-24"
title: "Primeros pasos en redux"
featuredImage: "https://image-cloud.example.png"
---
```

* **slug**: Es la url final que tendrá nuestro post
* **date**: La fecha de creación del post
* **title**: El título de nuestro post
* **featuredImage**: Una imagen de cabecera



## Crear plantilla de publicación de blog

Ahora, dentro del fichero `pages`, crearemos el archivo `{markdownRemark.frontmatter__slug}.jsx`, que será el responsable de dar el formato y estilo a nuestro post, dentro del código veremos que hace una consulta para obtener los metadatos de cada fichero que son los que usaremos para la cabecera del artículo.

```tsx
import * as React from "react";
import { graphql } from "gatsby";
import "./blog.css";
import "./prism.css";

const wrapperStyles = {
  overflow: "hidden",
};

const contentWrapperStyle = {
  "max-width": "800px",
  margin: "0 auto",
  padding: "140px 30px 30px 30px",
};

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
`;

export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  return (
    <div style={wrapperStyles}>
      <div style={contentWrapperStyle}>
        <h1 className="title-blog">{frontmatter.title}</h1>
        <p>{frontmatter.date}</p>
        <img src={frontmatter.featuredImage} alt={"Blog Header"} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
```

## Revisar los cambios

Ahora solo tendremos que ejecutar `npm run develop` y dirigirnos a la url `http://localhost:8000/blog/sample-post/` para ver el artículo publicado.

![Pagina publicada](https://user-images.githubusercontent.com/16117276/233855673-08633ef8-d140-4553-8b18-821283bfe69b.png)
