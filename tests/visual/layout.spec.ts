import { expect, test } from "@playwright/test";
import { preparePage, settle } from "./prepare";
import { ROUTES, VIEWPORTS } from "./routes";

/**
 * Numeric companion to the pixel baseline.
 *
 * Full-page screenshots are expensive (the home page is ~5000px tall), so they
 * only run at three widths — which means a section-height regression below the
 * fold can slip through at the other four. These snapshots record the height of
 * every top-level section at every width, so the fixed-height landmine
 * (`h-[1000px]`, `h-[1150px]`, …) is caught precisely and the diff is readable
 * in a pull request instead of being a picture.
 */
test.describe("layout metrics", () => {
  // Heights are colour-scheme independent; running one project avoids
  // duplicate snapshots that would have to be kept in sync.
  test.skip(({ colorScheme }) => colorScheme === "dark", "light project only");

  for (const route of ROUTES) {
    test(`${route.name} section heights`, async ({ page }) => {
      const measurements: Record<string, unknown> = {};

      for (const width of VIEWPORTS) {
        await page.setViewportSize({ width, height: 900 });
        await preparePage(page);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await settle(page, route.ready);

        measurements[`${width}px`] = await page.evaluate(() => {
          const main = document.querySelector("main");
          return {
            documentHeight: document.documentElement.scrollHeight,
            hasHorizontalOverflow:
              document.documentElement.scrollWidth >
              document.documentElement.clientWidth,
            sections: Array.from(main?.children ?? []).map((el) =>
              Math.round((el as HTMLElement).getBoundingClientRect().height)
            ),
          };
        });
      }

      expect(JSON.stringify(measurements, null, 2)).toMatchSnapshot(
        `${route.name}-layout.json`
      );
    });
  }
});
