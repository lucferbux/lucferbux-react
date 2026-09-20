import { iconUrl } from "../../utils/iconUrl";

interface EntityIconProps {
  /** Icon name from `public/images/icons/`, or a full URL. */
  icon: string | undefined | null;
  /** Rendered size in px. */
  size?: number;
  className?: string;
}

/**
 * The logo of an organisation on a résumé row or a course card.
 *
 * These come from Firestore, so the shape of the source file is not something
 * a component can rely on: the Three Points mark is a padded square SVG, the
 * OBS one is a full-bleed raster logo. Rendering them as-is put a hard square
 * next to a set of circles. Clipping to a circle here means every entry looks
 * the same whatever someone uploads later, and `object-cover` keeps a
 * non-square source from being stretched to fit.
 */
export default function EntityIcon({
  icon,
  size = 40,
  className = "",
}: EntityIconProps) {
  return (
    <img
      src={iconUrl(icon)}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full bg-white/15 object-cover ring-[0.5px] ring-white/25 ${className}`}
    />
  );
}
