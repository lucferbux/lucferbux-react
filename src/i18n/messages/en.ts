/**
 * English is the reference dictionary. `es.ts` is typed `satisfies typeof en`,
 * so a missing or misspelled key is a compile error rather than a runtime
 * warning.
 */
const en = {
  nav: {
    home: "Home",
    news: "News",
    projects: "Projects",
    posts: "Posts",
    teaching: "Teaching",
    oldWeb: "Old Web",
    admin: "Admin",
    privacy: "Privacy",
    terms: "Terms",
  },
  hero: {
    greeting: "Hi! I'm Lucas,",
    roles: ["a Full Stack", "an AI", "a Cloud"],
    roleSuffix: "Developer",
    intro:
      "Welcome to my web. In this site I gather all the news, posts, conferences and projects that I take part in.",
  },
  pages: {
    home: {
      title: "Home",
      description:
        "Personal site of Lucas Fernández Aragón: news, articles, talks and projects.",
    },
    news: {
      title: "News",
      description: "Latest news and milestones from my professional work.",
    },
    posts: {
      title: "Posts",
      description:
        "Articles on development, security, AI and cloud-native engineering.",
    },
    projects: {
      title: "Projects",
      description: "Open-source and professional projects I have worked on.",
    },
    teaching: {
      title: "Teaching",
      description:
        "Courses I teach, with the material and source code free to browse.",
    },
    terms: {
      title: "Terms & Conditions",
      description: "Terms and conditions for the Lucferbux personal website.",
    },
    privacy: {
      title: "Privacy Policy",
      description: "Privacy policy for the Lucferbux personal website.",
    },
  },
  sections: {
    newsHome: {
      title: "Latest News",
      description: "Here are the latest news related to my professional work",
      button: "Browse news",
    },
    news: {
      title: "Latest News",
      description: "Here are the latest news related to my professional work",
    },
    projectsHome: {
      title: "Recent Projects",
      description:
        "These are a few of my latests projects I've been working on. Some of them are propietary, so there's no source code.",
      button: "Browse projects",
    },
    projects: {
      title: "Explore Projects",
      description:
        "These are a few of my latests projects I've been working on. Some of them are propietary, so there's no source code.",
    },
    postsHome: {
      title: "Tech Posts",
      description:
        "Personal posts and collaborations talking about multiple fields of Technology such as Development, Security, AI...",
      button: "Browse posts",
    },
    posts: {
      title: "Tech Posts",
      description:
        "Personal posts and collaborations talking about multiple fields of Technology such as Development, Security, AI...",
    },
    teaching: {
      title: "Courses & Teaching",
      description:
        "Material from the courses I teach. Everything here is public \u2014 slides, notebooks and source code.",
    },
    resumee: {
      title: "My Resumée",
      description: "Here are the most important roles I've taken so far",
      experience: "Experience",
    },
  },
  resumee: {
    name: "Lucas Fernández",
    caption: "Software Developer",
    description:
      "Full-stack developer passionate about technology and innovation",
  },
  teaching: {
    courseSite: "Course site",
  },
  footer: {
    privacyNotice: "This site does not track any information about usage",
  },
  blog: {
    backToPosts: "Back to posts",
    onlyAvailableIn: {
      en: "This article is only available in English.",
      es: "This article is only available in Spanish.",
    },
  },
  common: {
    loading: "Loading",
    errorTitle: "Something went wrong",
    retry: "Try again",
  },
  notFound: {
    title: "Page not found",
    description:
      "The page you are looking for does not exist, or it has moved somewhere else.",
    backHome: "Back to home",
    browsePosts: "Browse posts",
  },
  a11y: {
    mainNav: "Main navigation",
    languageGroup: "Language",
    switchToEnglish: "Switch to English",
    switchToSpanish: "Cambiar a español",
    skipToContent: "Skip to content",
  },
} as const;

export default en;
