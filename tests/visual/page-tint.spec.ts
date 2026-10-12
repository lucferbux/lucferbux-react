import { expect, test } from "@playwright/test";
import { preparePage, settle } from "./prepare";

/**
 * The colour behind the iPhone status bar and in Safari's toolbar.
 *
 * On the public site that is the colour of the canvas — `body`'s background —
 * which must match the top of the page, while the pale page background sits on
 * the `.page-canvas` wrapper. The admin still does it the older way, with a
 * fixed opaque header for Safari to sample.
 *
 * Chromium cannot show what Safari does with either, so this checks the
 * preconditions rather than the outcome; the outcome needs a real device.
 */
const PUBLIC = [
  {
    name: "home",
    path: "/en",
    ready: "text=My Resumée",
    canvas: "rgb(201, 140, 49)",
  },
  {
    name: "news",
    path: "/en/news",
    ready: "text=Latest News",
    canvas: "rgb(0, 119, 137)",
  },
  {
    name: "terms",
    path: "/en/terms",
    ready: "text=Terms & Conditions",
    canvas: "rgb(0, 119, 137)",
  },
];

test.describe("page tint", () => {
  test.skip(({ colorScheme }) => colorScheme === "dark", "light project only");

  for (const { name, path, ready, canvas } of PUBLIC) {
    test(`${name} paints the canvas in the colour of the page top`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await preparePage(page);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await settle(page, ready);

      const colours = await page.evaluate(() => {
        const wrapper = document.querySelector(".page-canvas")!;
        return {
          html: getComputedStyle(document.documentElement).backgroundColor,
          body: getComputedStyle(document.body).backgroundColor,
          wrapper: getComputedStyle(wrapper).backgroundColor,
          wrapperHeight: wrapper.getBoundingClientRect().height,
          fixedAtTop: Array.from(document.querySelectorAll("*")).filter(
            (el) => {
              const style = getComputedStyle(el);
              return (
                style.position === "fixed" &&
                el.getBoundingClientRect().top <= 4 &&
                el.getBoundingClientRect().height > 0
              );
            }
          ).length,
        };
      });

      expect(colours.body).toBe(canvas);
      // AGENTS.md, landmine 12.
      expect(colours.html).toBe("rgba(0, 0, 0, 0)");
      // The page itself is still the pale background, and covers the canvas
      // even when its content is shorter than the screen.
      expect(colours.wrapper).toBe("rgb(242, 246, 255)");
      expect(colours.wrapperHeight).toBeGreaterThanOrEqual(900);
      // Nothing pinned to the top for Safari to sample instead: an element
      // there switches it from the canvas colour to a tint that can go stale.
      expect(colours.fixedAtTop).toBe(0);
    });
  }

  test("the canvas colour follows a client-side navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await preparePage(page);
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await settle(page, "text=My Resumée");

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "News" })
      .click();
    await settle(page, "text=Latest News");

    expect(
      await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    ).toBe("rgb(0, 119, 137)");
  });

  test("the admin header satisfies Safari's sampling rules", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await preparePage(page);
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await settle(page, "text=Dashboard");

    const header = await page.evaluate(() => {
      const el = document.querySelector("[data-page-tint]")!;
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return {
        position: style.position,
        pointerEvents: style.pointerEvents,
        backgroundColor: style.backgroundColor,
        top: Math.round(box.top),
        bottom: Math.round(box.bottom),
        widthRatio: box.width / window.innerWidth,
      };
    });

    // Fixed, starting at the top, >= 80% of viewport width, fully opaque,
    // hit-testable, and reaching past the band a few pixels down that Safari
    // samples.
    expect(header.position).toBe("fixed");
    expect(header.pointerEvents).not.toBe("none");
    expect(header.top).toBeLessThanOrEqual(4);
    expect(header.bottom).toBeGreaterThanOrEqual(8);
    expect(header.widthRatio).toBeGreaterThanOrEqual(0.8);
    expect(header.backgroundColor).toBe("rgb(0, 119, 137)");
  });

  test("the public header scrolls away with the page", async ({ page }) => {
    await preparePage(page);
    await page.goto("/en/news", { waitUntil: "domcontentloaded" });
    await settle(page, "text=Latest News");

    expect(
      await page.evaluate(
        () => getComputedStyle(document.querySelector("header")!).position
      )
    ).not.toBe("fixed");
  });

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
