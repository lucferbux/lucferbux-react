import { useEffect, useState } from "react";

/**
 * Custom hook for responsive breakpoint detection.
 * Uses window.matchMedia for efficient media query listening.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Sync initial value via the handler pattern to avoid direct setState in effect
    handler({ matches: mql.matches } as MediaQueryListEvent);
    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
