import type { Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PLACEHOLDER = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "placeholder.png"
);

/**
 * Freeze everything that would otherwise differ between two runs of the same
 * commit. Injected from the test rather than baked into the app, so the
 * baseline still reflects production CSS.
 */
const FREEZE_CSS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
  /* The cards swap in an animated GIF until their image loads. */
  img[src$="loading.gif"] { visibility: hidden !important; }
`;

export async function preparePage(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });

  // Blog posts and news cards pull images from Cloudinary, dev.to's S3 bucket
  // and user-images.githubusercontent.com. Serve a local placeholder instead so
  // screenshots don't depend on the network.
  //
  // Fulfil rather than abort: NewsCard and PostCard gate their rendered state
  // on the image's onLoad, so an aborted request would freeze them mid-render.
  await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (route) =>
    route.fulfill({ path: PLACEHOLDER, contentType: "image/png" })
  );

  await page.addInitScript(() => {
    // react-parallax-tilt reacts to pointer position; keep it at rest.
    window.matchMedia("(hover: hover)");
  });
}

export async function settle(page: Page, ready: string): Promise<void> {
  await page.waitForSelector(ready, { state: "visible", timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: FREEZE_CSS });

  // Every <img> either finished or failed — no half-painted cards.
  await page.waitForFunction(
    () =>
      Array.from(document.images).every((img) => img.complete),
    undefined,
    { timeout: 30_000 }
  );

  await page.waitForLoadState("networkidle");
}
