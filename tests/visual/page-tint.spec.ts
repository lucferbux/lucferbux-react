import { expect, test } from "@playwright/test";
import { preparePage, settle } from "./prepare";

/**
 * Safari 26 ignores `theme-color` and instead samples a fixed element near the
 * viewport top. These assertions encode its documented requirements, so the
 * moment someone makes the header translucent, narrow, or absolutely
 * positioned again, this fails rather than the toolbar quietly turning white.
 *
 * Chromium cannot reproduce Safari's tint derivation, so this checks the
 * preconditions rather than the outcome; the outcome needs a real device.
 */
const CASES = [
  {
    name: "home",
    path: "/en",
    ready: "text=My Resumée",
    expected: "rgb(201, 140, 49)",
  },
  {
    name: "news",
    path: "/en/news",
    ready: "text=Latest News",
    expected: "rgb(0, 119, 137)",
  },
  {
    name: "terms",
    path: "/en/terms",
    ready: "text=Terms & Conditions",
    expected: "rgb(0, 119, 137)",
  },
];

test.describe("page tint", () => {
  test.skip(({ colorScheme }) => colorScheme === "dark", "light project only");

  for (const { name, path, ready, expected } of CASES) {
    test(`${name} header satisfies Safari's sampling rules`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await preparePage(page);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await settle(page, ready);

      const header = await page.evaluate(() => {
        const el = document.querySelector("header");
        if (!el) return null;
        const style = getComputedStyle(el);
        const box = el.getBoundingClientRect();
        return {
          position: style.position,
          backgroundColor: style.backgroundColor,
          top: Math.round(box.top),
          widthRatio: box.width / window.innerWidth,
          height: Math.round(box.height),
        };
      });

      expect(header).not.toBeNull();
      // Fixed, within 4px of the top, >= 80% of viewport width, >= 3px tall,
      // and fully opaque.
      expect(header!.position).toBe("fixed");
      expect(header!.top).toBeLessThanOrEqual(4);
      expect(header!.widthRatio).toBeGreaterThanOrEqual(0.8);
      expect(header!.height).toBeGreaterThanOrEqual(3);
      expect(header!.backgroundColor).not.toMatch(/rgba\(.*,\s*0?\.\d+\)$/);
      expect(header!.backgroundColor).toBe(expected);
    });
  }

  test("the page declares a colour scheme", async ({ page }) => {
    await preparePage(page);
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await settle(page, "text=My Resumée");

    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).colorScheme
      )
    ).toBe("light dark");
  });

  test("keeps theme-color metas for browsers that still honour them", async ({
    page,
  }) => {
    await preparePage(page);
    await page.goto("/en/news", { waitUntil: "domcontentloaded" });
    await settle(page, "text=Latest News");

    const metas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('meta[name="theme-color"][data-rh]')
      ).map((m) => ({
        content: m.getAttribute("content"),
        media: m.getAttribute("media"),
      }))
    );

    expect(metas).toHaveLength(2);
    expect(metas.map((m) => m.media)).toEqual([
      "(prefers-color-scheme: light)",
      "(prefers-color-scheme: dark)",
    ]);
  });
});
