import { useCallback } from "react";
import { useTranslation } from "./LanguageContext";

/**
 * Prefix an app-internal path with the active locale.
 *
 * Absolute URLs and already-prefixed paths are returned untouched, so call
 * sites can pass whatever `menuData`/`footerData` hold without branching.
 */
export function useLocalePath(): (path: string) => string {
  const { locale } = useTranslation();

  return useCallback(
    (path: string) => {
      if (!path.startsWith("/")) return path;
      if (path === "/") return `/${locale}`;
      // Admin lives outside the localized tree.
      if (path.startsWith("/admin")) return path;
      const first = path.split("/")[1];
      if (first === "en" || first === "es") return path;
      return `/${locale}${path}`;
    },
    [locale]
  );
}
