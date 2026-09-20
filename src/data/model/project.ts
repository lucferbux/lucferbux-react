import { Timestamp } from "firebase/firestore";

export interface Project {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  link: string;
  tags: string | string[];
  /** Extra destinations beyond `link`, e.g. sub-sections of a site. */
  links?: { label: string; url: string }[];
  featured: boolean;
  date: Timestamp | Date;
  version: string;
}

export interface ProjectId extends Project {
  id: string;
}
