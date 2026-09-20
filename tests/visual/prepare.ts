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

  await page.addInitScript((css: string) => {
    // react-parallax-tilt reacts to pointer position; keep it at rest.
    window.matchMedia("(hover: hover)");

    // Install the freeze before the first paint.
    //
    // This used to be an addStyleTag() after load, which left a window in
    // which the hero's seven floating PNGs and the fade-in had already
    // started. They then froze at whatever frame they happened to reach,
    // varying by 100-260 pixels between runs — enough to make the home page
    // flake once the colour threshold was tightened.
    const install = () => {
      const style = document.createElement("style");
      style.id = "visual-freeze";
      style.textContent = css;
      document.head.appendChild(style);
    };

    if (document.head) install();
    else document.addEventListener("DOMContentLoaded", install, { once: true });
  }, FREEZE_CSS);
}

export async function settle(page: Page, ready: string): Promise<void> {
  await page.waitForSelector(ready, { state: "visible", timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);

  // Belt and braces: the init script installs this before first paint, but a
  // client-rendered route can replace <head> content on navigation.
  if ((await page.locator("#visual-freeze").count()) === 0) {
    await page.addStyleTag({ content: FREEZE_CSS });
  }

  // Every <img> either finished or failed — no half-painted cards.
  //
  // An image with no layout box is excluded, because it never resolves: the
  // admin list thumbnail is both `loading="lazy"` and `max-xs:hidden`, so
  // below 450px the browser is right not to fetch it and `complete` stays
  // false for the life of the page. It cannot affect the screenshot either.
  await page.waitForFunction(
    () =>
      Array.from(document.images).every(
        (img) => img.complete || img.getClientRects().length === 0
      ),
    undefined,
    { timeout: 30_000 }
  );

  await page.waitForLoadState("networkidle");
}
