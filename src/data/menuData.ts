import type { Messages } from "../i18n/LanguageContext";
import type { Section } from "../hooks/useActiveSection";
import {
  HomeIcon,
  NewsIcon,
  PostsIcon,
  ProjectsIcon,
  TeachingIcon,
  type NavIcon,
} from "../components/icons/NavIcons";

/**
 * `labelKey` indexes into `messages.nav` rather than holding a string, so the
 * label lives in one place per language and cannot drift from the dictionary.
 * `key` is what `useActiveSection` returns, which is how a link knows it is
 * the current one.
 */
export interface MenuItem {
  key: Section;
  labelKey: keyof Messages["nav"];
  Icon: NavIcon;
  link: string;
}

export const homeItem: MenuItem = {
  key: "home",
  labelKey: "home",
  Icon: HomeIcon,
  link: "/",
};

/** The header's links. Home is the logo there, so it is not in this list. */
export const menuData: MenuItem[] = [
  { key: "news", labelKey: "news", Icon: NewsIcon, link: "/news" },
  {
    key: "projects",
    labelKey: "projects",
    Icon: ProjectsIcon,
    link: "/projects",
  },
  { key: "posts", labelKey: "posts", Icon: PostsIcon, link: "/posts" },
  {
    key: "teaching",
    labelKey: "teaching",
    Icon: TeachingIcon,
    link: "/teaching",
  },
];

/** The mobile tab bar has no logo, so Home is a tab of its own. */
export const tabItems: MenuItem[] = [homeItem, ...menuData];
