import type { Messages } from "../i18n/LanguageContext";

export interface FooterItem {
  labelKey: keyof Messages["nav"];
  icon: string;
  link: string;
  external: boolean;
}

export const footerData: FooterItem[] = [
  {
    labelKey: "home",
    icon: "/images/icons/home.svg",
    link: "/",
    external: false,
  },
  {
    labelKey: "projects",
    icon: "/images/icons/code.svg",
    link: "/projects",
    external: false,
  },
  {
    labelKey: "news",
    icon: "/images/icons/courses.svg",
    link: "/news",
    external: false,
  },
  {
    labelKey: "posts",
    icon: "/images/icons/vector.svg",
    link: "/posts",
    external: false,
  },
  {
    labelKey: "teaching",
    icon: "/images/icons/courses.svg",
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
