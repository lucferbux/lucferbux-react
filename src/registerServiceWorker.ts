/**
 * Register the service worker, and actually pick up new deployments.
 *
 * The generated registration this replaces was one line — `register('/sw.js')`
 * and nothing else. Combined with a precached `index.html`, that meant a
 * returning visitor was served the previous build's HTML, pointing at the
 * previous build's hashed assets, and nothing ever told the page to refresh.
 * A phone that had the site open could sit on a weeks-old version.
 *
 * Three things fix it:
 *
 * - `updateViaCache: "none"`, so the browser re-fetches `sw.js` itself from the
 *   network instead of its own HTTP cache. Without this the update check can
 *   be answered by a cached copy of the old worker and finds nothing new.
 * - An explicit `update()` on load, on an interval, and whenever the tab
 *   becomes visible again. An installed PWA can stay open for days without a
 *   navigation, which is the only moment the browser checks on its own.
 * - A reload when a *new* worker takes control.
 */

/** An installed PWA can go days without a navigation. */
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export interface RegisterOptions {
  /** Injected in tests. */
  container?: ServiceWorkerContainer;
  reload?: () => void;
  intervalMs?: number;
}

export function registerServiceWorker({
  container = typeof navigator !== "undefined"
    ? navigator.serviceWorker
    : undefined,
  reload = () => window.location.reload(),
  intervalMs = UPDATE_CHECK_INTERVAL_MS,
}: RegisterOptions = {}): void {
  if (!container) return;

  // Whether this page was already being controlled when it loaded. If it was,
  // a later `controllerchange` means a new build has taken over and everything
  // on screen is from the old one. If it was not, the change is just this
  // page's first install finishing — reloading there would make every first
  // visit flash for no reason.
  const wasControlled = Boolean(container.controller);
  let reloading = false;

  container.addEventListener("controllerchange", () => {
    if (!wasControlled || reloading) return;
    // The worker ships `skipWaiting`, so by this point the new build is
    // already serving requests while the page holds the old one's assets. A
    // lazily-loaded chunk from the old build may no longer exist. Reloading
    // promptly is the safer of the two inconsistent states, and the update
    // check runs on load, so in practice this lands a second or two in.
    reloading = true;
    reload();
  });

  container
    .register("/sw.js", { scope: "/", updateViaCache: "none" })
    .then((registration) => {
      // A failed check is not worth reporting: the next one is a tab focus away.
      const check = () => void registration.update().catch(() => {});

      check();
      window.setInterval(check, intervalMs);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") check();
      });
    })
    .catch(() => {
      // Registration can fail on an unsupported or private-mode browser. The
      // site works without it; there is nothing useful to do here.
    });
}
