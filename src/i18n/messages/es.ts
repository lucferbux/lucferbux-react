import type en from "./en";
import type { WidenMessages } from "./types";

/**
 * `satisfies` gives compile-time completeness: adding a key to `en.ts` without
 * translating it here fails the build.
 */
const es = {
  nav: {
    home: "Inicio",
    news: "Novedades",
    projects: "Proyectos",
    posts: "Artículos",
    teaching: "Docencia",
    oldWeb: "Web antigua",
    admin: "Admin",
    privacy: "Privacidad",
    terms: "Términos",
  },
  hero: {
    greeting: "¡Hola! Soy Lucas,",
    roles: ["Full Stack", "de IA", "de Cloud"],
    roleSuffix: "Desarrollador",
    intro:
      "Bienvenido a mi web. Aquí reúno las novedades, artículos, charlas y proyectos en los que participo.",
  },
  pages: {
    home: {
      title: "Inicio",
      description:
        "Web personal de Lucas Fernández Aragón: novedades, artículos, charlas y proyectos.",
    },
    news: {
      title: "Novedades",
      description: "Las últimas novedades e hitos de mi trabajo profesional.",
    },
    posts: {
      title: "Artículos",
      description:
        "Artículos sobre desarrollo, seguridad, IA e ingeniería cloud-native.",
    },
    projects: {
      title: "Proyectos",
      description:
        "Proyectos de código abierto y profesionales en los que he trabajado.",
    },
    terms: {
      title: "Términos y condiciones",
      description: "Términos y condiciones de la web personal de Lucferbux.",
    },
    privacy: {
      title: "Política de privacidad",
      description: "Política de privacidad de la web personal de Lucferbux.",
    },
  },
  sections: {
    newsHome: {
      title: "Últimas novedades",
      description: "Estas son las últimas novedades sobre mi trabajo",
      button: "Ver novedades",
    },
    news: {
      title: "Últimas novedades",
      description: "Estas son las últimas novedades sobre mi trabajo",
    },
    projectsHome: {
      title: "Proyectos recientes",
      description:
        "Algunos de los últimos proyectos en los que he trabajado. Varios son propietarios, así que no tienen código público.",
      button: "Ver proyectos",
    },
    projects: {
      title: "Explora los proyectos",
      description:
        "Algunos de los últimos proyectos en los que he trabajado. Varios son propietarios, así que no tienen código público.",
    },
    postsHome: {
      title: "Artículos técnicos",
      description:
        "Artículos propios y colaboraciones sobre distintos campos de la tecnología: desarrollo, seguridad, IA...",
      button: "Ver artículos",
    },
    posts: {
      title: "Artículos técnicos",
      description:
        "Artículos propios y colaboraciones sobre distintos campos de la tecnología: desarrollo, seguridad, IA...",
    },
    resumee: {
      title: "Mi currículum",
      description: "Estos son los puestos más relevantes de mi trayectoria",
      experience: "Experiencia",
    },
  },
  resumee: {
    name: "Lucas Fernández",
    caption: "Desarrollador de software",
    description:
      "Desarrollador full-stack apasionado por la tecnología y la innovación",
  },
  footer: {
    privacyNotice: "Este sitio no registra ninguna información de uso",
  },
  blog: {
    backToPosts: "Volver a los artículos",
    onlyAvailableIn: {
      en: "Este artículo sólo está disponible en inglés.",
      es: "Este artículo sólo está disponible en español.",
    },
  },
  common: {
    loading: "Cargando",
    errorTitle: "Algo ha salido mal",
    retry: "Reintentar",
  },
  notFound: {
    title: "Página no encontrada",
    description: "La página que buscas no existe o se ha movido a otro sitio.",
    backHome: "Volver al inicio",
    browsePosts: "Ver artículos",
  },
  a11y: {
    languageGroup: "Idioma",
    switchToEnglish: "Switch to English",
    switchToSpanish: "Cambiar a español",
    skipToContent: "Saltar al contenido",
  },
} as const satisfies WidenMessages<typeof en>;

export default es;
