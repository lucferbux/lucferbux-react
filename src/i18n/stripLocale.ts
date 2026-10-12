/** `/es/news` → `/news`, `/en` → ``. Paths without a locale prefix pass through. */
export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(en|es)(?=\/|$)/, "");
}
