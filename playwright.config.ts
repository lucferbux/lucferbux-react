import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

/**
 * Visual regression baseline.
 *
 * The site's landing page is a stack of fixed-height sections containing
 * absolutely-positioned wave SVGs (see the Landmines section of AGENTS.md), so
 * almost any change can shift it silently. This suite is the safety net.
 *
 * Determinism comes from four places:
 *  - `VITE_FIXTURE_DATA=1` builds against the `content/seed/` corpus instead of live
 *    Firestore, and renders a static typewriter;
 *  - animations are frozen and `prefers-reduced-motion` is emulated;
 *  - remote images are fulfilled from a local placeholder;
 *  - locale and timezone are pinned, so `toLocaleDateString` is stable.
 *
 * The baseline is gitignored and local: PNGs are derived artifacts, they are
 * tens of megabytes, and font rasterisation differs between platforms so they
 * would not transfer anyway. Generate one with `npm run visual:baseline` on an
 * unmodified tree before relying on `npm run visual`.
 */
export default defineConfig({
  testDir: "./tests/visual",
  // Baselines are platform-scoped: font rasterisation differs between macOS and
  // Linux, so a darwin baseline would diff on antialiasing alone in a Linux CI
  // container. Each platform keeps its own set.
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["html"], ["list"]] : [["list"]],

  expect: {
    toHaveScreenshot: {
      // Absorbs sub-pixel antialiasing without hiding real layout shifts.
      maxDiffPixelRatio: 0.002,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    },
  },

  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${PORT}`,
    locale: "en-US",
    timezoneId: "UTC",
    colorScheme: "light",
    deviceScaleFactor: 1,
    // The PWA service worker would otherwise serve stale content across runs.
    serviceWorkers: "block",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "light", use: { colorScheme: "light" } },
    { name: "dark", use: { colorScheme: "dark" } },
  ],

  webServer: {
    command: `VITE_FIXTURE_DATA=1 npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
