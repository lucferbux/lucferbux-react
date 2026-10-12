import type { Messages } from "../i18n/LanguageContext";
import {
  HomeIcon,
  NewsIcon,
  PostsIcon,
  ProjectsIcon,
  TeachingIcon,
  type NavIcon,
} from "../components/icons/NavIcons";

export interface FooterItem {
  labelKey: keyof Messages["nav"];
  /** A component from the shared nav set, or a path for the one-off items. */
  icon: string | NavIcon;
  link: string;
  external: boolean;
}

export const footerData: FooterItem[] = [
  {
    labelKey: "home",
    icon: HomeIcon,
    link: "/",
    external: false,
  },
  {
    labelKey: "projects",
    icon: ProjectsIcon,
    link: "/projects",
    external: false,
  },
  {
    labelKey: "news",
    icon: NewsIcon,
    link: "/news",
    external: false,
  },
  {
    labelKey: "posts",
    icon: PostsIcon,
    link: "/posts",
    external: false,
  },
  {
    labelKey: "teaching",
    icon: TeachingIcon,
    link: "/teaching",
    external: false,
  },
  {
    labelKey: "oldWeb",
    icon: "/images/icons/calendar.svg",
    link: "https://lucferbux-web-page.web.app",
    external: true,
  },
  {
    labelKey: "admin",
    icon: "/images/icons/account.svg",
    link: "/admin/login",
    external: false,
  },
];
