import type { LocalizedValue } from "../../i18n/localized";

export interface TeachingLink {
  label: string;
  url: string;
}

export interface Teaching {
  title: LocalizedValue;
  description: LocalizedValue;
  /** School or programme the course belongs to. */
  institution: LocalizedValue;
  /** Free text, e.g. "2019 – Present". */
  period: string;
  /** Public course site, when there is one. */
  siteUrl?: string;
  /** Source repository, when there is one. */
  repoUrl?: string;
  /**
   * Anything else worth linking — the Python course, for instance, is four
   * Colab notebooks with no repository.
   */
  links?: TeachingLink[];
  /** Resolved as /images/icons/{icon}.svg. */
  icon: string;
  tags?: string[];
  /** Lower sorts first. */
  importance: number;
}

export interface TeachingId extends Teaching {
  id: string;
}
