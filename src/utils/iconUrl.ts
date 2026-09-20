/**
 * Resolve an `icon` field to an image URL.
 *
 * Most entries name a file in `public/images/icons/`, but some organisations
 * only have a raster logo, which lives in Firebase Storage. Accepting a full
 * URL means those entries do not need an SVG committed to the repo.
 */
export function iconUrl(icon: string | undefined | null): string {
  if (!icon) return "";
  if (/^https?:\/\//.test(icon) || icon.startsWith("/")) return icon;
  return `/images/icons/${icon}.svg`;
}
