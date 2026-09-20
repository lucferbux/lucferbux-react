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
  { name: "home", path: "/", ready: "text=My Resumée", fullPage: true },
  { name: "news", path: "/news", ready: "text=Latest News" },
  { name: "posts", path: "/posts", ready: "text=Tech Posts" },
  { name: "projects", path: "/projects", ready: "text=Explore Projects" },
  { name: "blog-post", path: "/blog/react-solid", ready: "text=SOLID" },
  { name: "admin-login", path: "/admin/login", ready: "#email" },

  // Currently empty stubs — the baseline records that, so wiring up the
  // already-written termsSection/privacySection shows as an intentional diff.
  { name: "terms", path: "/terms", ready: "body" },
  { name: "privacy", path: "/privacy", ready: "body" },

  // Both of these bounce to home today (BlogPostPage sends bad slugs to /404,
  // which is not a route, so the catch-all redirects to /).
  { name: "blog-missing", path: "/blog/does-not-exist", ready: "text=My Resumée" },
  { name: "not-found", path: "/no-such-page", ready: "text=My Resumée" },
];

/** Widths chosen to straddle every declared breakpoint plus common devices. */
export const VIEWPORTS = [375, 390, 430, 768, 1000, 1234, 1440] as const;

/** Full-page capture is expensive on a ~5000px home page; sample three widths. */
export const FULL_PAGE_VIEWPORTS = new Set([375, 768, 1440]);
