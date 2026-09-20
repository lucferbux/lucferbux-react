import type { CollectionSchema, FieldSchema, SelectOption } from "./types";
import { KNOWN_POST_SLUGS } from "../../pages/BlogPostPage";

export * from "./types";

const required = {
  en: "This field is required",
  es: "Este campo es obligatorio",
};

function url(value: unknown) {
  if (typeof value !== "string" || value === "") return null;
  try {
    new URL(value);
    return null;
  } catch {
    return {
      en: "Enter a full URL, including https://",
      es: "Introduce una URL completa, incluyendo https://",
    };
  }
}

/**
 * `ResumeeCardRow` renders `/images/icons/{icon}.svg`, so a typo silently 404s
 * the image. Offering the real file list removes the class of bug entirely.
 */
const ICON_OPTIONS: SelectOption[] = [
  "redhat",
  "telefonica",
  "deloitte",
  "visiotech",
  "threepoints",
  "uem",
  "geekshub",
  "team",
  "code",
  "book",
  "certificates",
  "award",
].map((value) => ({ value, label: value }));

/** Localized title/description pair, which every collection has. */
function titleAndDescription(): FieldSchema[] {
  return [
    {
      name: "title",
      type: "text",
      i18n: true,
      required: true,
      listColumn: true,
      label: { en: "Title", es: "Título" },
    },
    {
      name: "description",
      type: "textarea",
      i18n: true,
      required: true,
      label: { en: "Description", es: "Descripción" },
    },
  ];
}

export const NEWS_SCHEMA: CollectionSchema = {
  key: "news",
  path: "intro",
  label: { en: "News", es: "Novedades" },
  icon: "courses",
  titleField: "title",
  defaultSort: { field: "timestamp", dir: "desc" },
  searchFields: ["title", "description"],
  fields: [
    ...titleAndDescription(),
    {
      name: "url",
      type: "url",
      required: true,
      validate: url,
      label: { en: "Link", es: "Enlace" },
    },
    {
      name: "image",
      type: "image",
      required: true,
      storagePath: "images/intro",
      label: { en: "Image", es: "Imagen" },
    },
    {
      name: "timestamp",
      type: "date",
      required: true,
      listColumn: true,
      label: { en: "Date", es: "Fecha" },
    },
    {
      name: "loaded",
      type: "boolean",
      hidden: true,
      defaultValue: true,
      label: { en: "Loaded", es: "Cargado" },
    },
  ],
};

export const POSTS_SCHEMA: CollectionSchema = {
  key: "posts",
  path: "patent",
  label: { en: "Posts", es: "Artículos" },
  icon: "vector",
  titleField: "title",
  defaultSort: { field: "date", dir: "desc" },
  searchFields: ["title", "description"],
  fields: [
    ...titleAndDescription(),
    {
      name: "link",
      type: "url",
      validate: url,
      label: { en: "External link", es: "Enlace externo" },
      help: {
        en: "Used when the post is hosted elsewhere.",
        es: "Se usa cuando el artículo está alojado en otro sitio.",
      },
    },
    {
      name: "internalLink",
      type: "select",
      // Choosing from the markdown slugs that actually exist replaces a
      // free-text field whose typos silently led nowhere.
      options: () => [
        { value: "", label: "—" },
        ...KNOWN_POST_SLUGS.map((slug) => ({ value: slug, label: slug })),
      ],
      label: { en: "Blog post", es: "Artículo del blog" },
      help: {
        en: "Link to a markdown post in this repo instead of an external URL.",
        es: "Enlaza a un artículo markdown de este repo en vez de a una URL externa.",
      },
    },
    {
      name: "image",
      type: "image",
      required: true,
      storagePath: "images/patent",
      label: { en: "Image", es: "Imagen" },
    },
    {
      name: "date",
      type: "date",
      required: true,
      listColumn: true,
      label: { en: "Date", es: "Fecha" },
    },
    {
      name: "loaded",
      type: "boolean",
      hidden: true,
      defaultValue: true,
      label: { en: "Loaded", es: "Cargado" },
    },
  ],
};

export const PROJECTS_SCHEMA: CollectionSchema = {
  key: "projects",
  path: "project",
  label: { en: "Projects", es: "Proyectos" },
  icon: "code",
  titleField: "title",
  defaultSort: { field: "date", dir: "desc" },
  searchFields: ["title", "description", "tags"],
  fields: [
    ...titleAndDescription(),
    {
      name: "link",
      type: "url",
      validate: url,
      label: { en: "Link", es: "Enlace" },
    },
    {
      name: "tags",
      type: "tags",
      listColumn: true,
      label: { en: "Tags", es: "Etiquetas" },
      help: {
        en: "Comma separated.",
        es: "Separadas por comas.",
      },
    },
    {
      name: "links",
      type: "linklist",
      label: { en: "Extra links", es: "Enlaces adicionales" },
      help: {
        en: 'One per line, as "Label | https://…". For projects whose site has sections worth linking directly.',
        es: 'Uno por línea, como "Etiqueta | https://…". Para proyectos cuya web tiene secciones que merece la pena enlazar.',
      },
    },
    {
      name: "version",
      type: "text",
      label: { en: "Version", es: "Versión" },
    },
    {
      name: "featured",
      type: "boolean",
      label: { en: "Featured on the home page", es: "Destacado en la portada" },
    },
    {
      name: "date",
      type: "date",
      required: true,
      listColumn: true,
      label: { en: "Date", es: "Fecha" },
    },
  ],
};

export const WORK_SCHEMA: CollectionSchema = {
  key: "work",
  path: "team",
  label: { en: "Résumé", es: "Currículum" },
  icon: "profile",
  titleField: "name",
  defaultSort: { field: "importance", dir: "asc" },
  searchFields: ["name", "job", "description"],
  fields: [
    {
      name: "name",
      type: "text",
      i18n: true,
      required: true,
      listColumn: true,
      label: { en: "Role / organisation", es: "Puesto / organización" },
    },
    {
      name: "job",
      type: "text",
      i18n: true,
      required: true,
      listColumn: true,
      label: { en: "Dates", es: "Fechas" },
      help: {
        en: "For example 2021 – Present",
        es: "Por ejemplo 2021 – Actualidad",
      },
    },
    {
      name: "description",
      type: "textarea",
      i18n: true,
      required: true,
      label: { en: "Description", es: "Descripción" },
    },
    {
      name: "avatar",
      type: "image",
      storagePath: "images/team",
      label: { en: "Avatar", es: "Avatar" },
    },
    {
      name: "icon",
      type: "select",
      required: true,
      options: ICON_OPTIONS,
      label: { en: "Icon", es: "Icono" },
      help: {
        en: "Resolved as /images/icons/{icon}.svg.",
        es: "Se resuelve como /images/icons/{icon}.svg.",
      },
    },
    {
      name: "importance",
      type: "number",
      required: true,
      listColumn: true,
      label: { en: "Sort order", es: "Orden" },
      help: {
        en: "Lower values appear first. Must be a number: live data mixes numbers and strings, which breaks ordering.",
        es: "Los valores más bajos aparecen primero. Debe ser un número: los datos actuales mezclan números y cadenas, lo que rompe la ordenación.",
      },
      validate: (value) =>
        typeof value === "number" && Number.isFinite(value)
          ? null
          : { en: "Must be a number", es: "Debe ser un número" },
    },
    {
      name: "loaded",
      type: "boolean",
      hidden: true,
      defaultValue: true,
      label: { en: "Loaded", es: "Cargado" },
    },
  ],
};

export const TEACHING_SCHEMA: CollectionSchema = {
  key: "teaching",
  path: "teaching",
  label: { en: "Teaching", es: "Docencia" },
  icon: "courses",
  titleField: "title",
  defaultSort: { field: "importance", dir: "asc" },
  searchFields: ["title", "description", "institution"],
  fields: [
    ...titleAndDescription(),
    {
      name: "institution",
      type: "text",
      i18n: true,
      required: true,
      listColumn: true,
      label: { en: "Institution", es: "Institución" },
    },
    {
      name: "period",
      type: "text",
      required: true,
      listColumn: true,
      label: { en: "Period", es: "Periodo" },
      help: {
        en: "For example 2019 – Present",
        es: "Por ejemplo 2019 – Actualidad",
      },
    },
    {
      name: "siteUrl",
      type: "url",
      validate: url,
      label: { en: "Course site", es: "Web del curso" },
    },
    {
      name: "repoUrl",
      type: "url",
      validate: url,
      label: { en: "Repository", es: "Repositorio" },
    },
    {
      name: "links",
      type: "linklist",
      label: { en: "Other links", es: "Otros enlaces" },
      help: {
        en: 'One per line, as "Label | https://…". Used for courses with no repository, such as Colab notebooks.',
        es: 'Uno por línea, como "Etiqueta | https://…". Para cursos sin repositorio, como los notebooks de Colab.',
      },
    },
    {
      name: "tags",
      type: "tags",
      label: { en: "Topics", es: "Temas" },
      help: { en: "Comma separated.", es: "Separados por comas." },
    },
    {
      name: "icon",
      type: "select",
      required: true,
      options: ICON_OPTIONS,
      label: { en: "Icon", es: "Icono" },
    },
    {
      name: "importance",
      type: "number",
      required: true,
      listColumn: true,
      label: { en: "Sort order", es: "Orden" },
      validate: (value) =>
        typeof value === "number" && Number.isFinite(value)
          ? null
          : { en: "Must be a number", es: "Debe ser un número" },
    },
  ],
};

export const SCHEMAS = {
  news: NEWS_SCHEMA,
  posts: POSTS_SCHEMA,
  projects: PROJECTS_SCHEMA,
  work: WORK_SCHEMA,
  teaching: TEACHING_SCHEMA,
} as const;

export const REQUIRED_MESSAGE = required;
