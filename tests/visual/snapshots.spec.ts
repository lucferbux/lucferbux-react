import { expect, test } from "@playwright/test";
import { preparePage, settle } from "./prepare";
import { FULL_PAGE_VIEWPORTS, ROUTES, VIEWPORTS } from "./routes";

for (const route of ROUTES) {
  test.describe(route.name, () => {
    for (const width of VIEWPORTS) {
      const fullPage = route.fullPage === true && FULL_PAGE_VIEWPORTS.has(width);

      test(`${route.name} @ ${width}px${fullPage ? " (full)" : ""}`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await preparePage(page);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await settle(page, route.ready);

        await expect(page).toHaveScreenshot(
          `${route.name}-${width}-${testInfo.project.name}.png`,
          { fullPage }
        );
      });
    }
  });
}
