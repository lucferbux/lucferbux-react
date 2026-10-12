import type { ReactNode } from "react";

export interface NavIconProps {
  className?: string;
}

export type NavIcon = (props: NavIconProps) => ReactNode;

/**
 * One family for the header, the footer and the mobile tab bar: a 28px grid,
 * a 1.9 stroke with round caps and joins, and `currentColor` throughout so the
 * active state is a colour change on the link rather than a second asset.
 */
function Glyph({
  className,
  children,
}: NavIconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function HomeIcon({ className }: NavIconProps) {
  return (
    <Glyph className={className}>
      <path d="M4.5 12.4 14 4.6l9.5 7.8" />
      <path d="M6.8 10.9V21a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2V10.9" />
      <path d="M11.5 23v-5.3a2.5 2.5 0 0 1 5 0V23" />
    </Glyph>
  );
}

export function NewsIcon({ className }: NavIconProps) {
  return (
    <Glyph className={className}>
      <rect x="4.5" y="5.5" width="19" height="17" rx="3.5" />
      <path d="M8.5 10.3h11" />
      <rect x="8.5" y="14" width="4.6" height="4.6" rx="1" />
      <path d="M16.3 14.4h3.2M16.3 18.2h3.2" />
    </Glyph>
  );
}

export function ProjectsIcon({ className }: NavIconProps) {
  return (
    <Glyph className={className}>
      <path d="M9.8 8.6 4.2 14l5.6 5.4" />
      <path d="M18.2 8.6l5.6 5.4-5.6 5.4" />
      <path d="M15.8 6.4l-3.6 15.2" />
    </Glyph>
  );
}

export function PostsIcon({ className }: NavIconProps) {
  return (
    <Glyph className={className}>
      <path d="M17.8 5.7a2.4 2.4 0 0 1 3.4 0l1.1 1.1a2.4 2.4 0 0 1 0 3.4L10.5 22 5 23l1-5.5L17.8 5.7z" />
      <path d="M15.6 7.9l4.5 4.5" />
    </Glyph>
  );
}

export function TeachingIcon({ className }: NavIconProps) {
  return (
    <Glyph className={className}>
      <path d="M14 6 3.2 11.4 14 16.8l10.8-5.4L14 6z" />
      <path d="M7.6 13.7v4.9c0 1.3 2.9 3.2 6.4 3.2s6.4-1.9 6.4-3.2v-4.9" />
      <path d="M24.8 11.4v6" />
    </Glyph>
  );
}
