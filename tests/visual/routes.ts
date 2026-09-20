export interface VisualRoute {
  /** Stable name used in the screenshot filename. */
  name: string;
  path: string;
  /**
   * Text that only appears once the route has finished rendering. Waiting on a
   * selector rather than a timeout is what keeps this suite from flaking.
   */
  ready: string;
  /**
   * Capture the whole scroll height rather than just the viewport. Reserved for
   * the tall, wave-stacked pages where a regression could hide below the fold.
   */
  fullPage?: boolean;
}

export const ROUTES: VisualRoute[] = [
  { name: "home", path: "/en", ready: "text=My Resumée", fullPage: true },
  { name: "news", path: "/en/news", ready: "text=Latest News" },
  { name: "posts", path: "/en/posts", ready: "text=Tech Posts" },
  { name: "projects", path: "/en/projects", ready: "text=Explore Projects" },
  { name: "blog-post", path: "/en/blog/react-solid", ready: "text=SOLID" },
  {
    name: "teaching",
    path: "/en/teaching",
    ready: "text=Courses & Teaching",
  },
  { name: "terms", path: "/en/terms", ready: "text=Terms & Conditions" },
  { name: "privacy", path: "/en/privacy", ready: "text=Privacy Policy" },
  { name: "not-found", path: "/en/no-such-page", ready: "text=404" },
  { name: "admin-login", path: "/admin/login", ready: "#email" },
  // Behind the auth guard; fixture builds bypass it (see AdminLayout).
  { name: "admin-dashboard", path: "/admin", ready: "text=Dashboard" },
  { name: "admin-list", path: "/admin/news", ready: "text=entries" },

  // Spanish. The landing page carries the most text, and Spanish copy runs
  // 15-20% longer than English, so this is where a fixed-height section would
  // clip first.
  {
    name: "home-es",
    path: "/es",
    ready: "text=Mi currículum",
    fullPage: true,
  },
  { name: "news-es", path: "/es/news", ready: "text=Últimas novedades" },
  { name: "posts-es", path: "/es/posts", ready: "text=Artículos técnicos" },
  {
    name: "projects-es",
    path: "/es/projects",
    ready: "text=Explora los proyectos",
  },
  {
    name: "teaching-es",
    path: "/es/teaching",
    ready: "text=Cursos y docencia",
  },
];

/** Widths chosen to straddle every declared breakpoint plus common devices. */
export const VIEWPORTS = [375, 390, 430, 768, 1000, 1234, 1440] as const;

/** Full-page capture is expensive on a ~5000px home page; sample three widths. */
export const FULL_PAGE_VIEWPORTS = new Set([375, 768, 1440]);
