import { useEffect, useState } from "react";

// jsdom has no `matchMedia`; there the query simply never matches.
const supported = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/**
 * Custom hook for responsive breakpoint detection.
 * Uses window.matchMedia for efficient media query listening.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    supported() ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (!supported()) return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Sync initial value via the handler pattern to avoid direct setState in effect
    handler({ matches: mql.matches } as MediaQueryListEvent);
    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
