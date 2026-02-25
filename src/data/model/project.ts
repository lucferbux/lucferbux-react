import { Timestamp } from "firebase/firestore";

export interface Project {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  link: string;
  tags: string;
  featured: boolean;
  date: Timestamp | Date;
  version: string;
}

export interface ProjectId extends Project {
  id: string;
}
