import { useLocation } from "react-router-dom";
import { stripLocale } from "../i18n/stripLocale";

export type Section = "home" | "news" | "projects" | "posts" | "teaching";

const SECTIONS: Record<string, Section> = {
  "": "home",
  news: "news",
  projects: "projects",
  posts: "posts",
  // An article is read from the posts list, so it keeps that tab lit.
  blog: "posts",
  teaching: "teaching",
};

/** The nav section a path belongs to, or `null` for pages outside the nav
 *  (terms, privacy, the 404). */
export function sectionOf(pathname: string): Section | null {
  const segment = stripLocale(pathname).split("/")[1] ?? "";
  return SECTIONS[segment] ?? null;
}

export function useActiveSection(): Section | null {
  return sectionOf(useLocation().pathname);
}
