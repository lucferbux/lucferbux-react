import type { Messages } from "../i18n/LanguageContext";

/**
 * `labelKey` indexes into `messages.nav` rather than holding a string, so the
 * label lives in one place per language and cannot drift from the dictionary.
 */
export interface MenuItem {
  labelKey: keyof Messages["nav"];
  icon: string;
  link: string;
}

export const menuData: MenuItem[] = [
  { labelKey: "news", icon: "/images/icons/courses.svg", link: "/news" },
  { labelKey: "projects", icon: "/images/icons/code.svg", link: "/projects" },
  { labelKey: "posts", icon: "/images/icons/vector.svg", link: "/posts" },
];
