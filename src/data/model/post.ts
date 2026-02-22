import { Timestamp } from "firebase/firestore";

export interface Post {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  link: string;
  image: string;
  date: Timestamp | Date;
  loaded: boolean;
  internalLink?: string;
}

export interface PostId extends Post {
  id: string;
}
