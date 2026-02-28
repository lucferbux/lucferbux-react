import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load the home page with the hero section", async ({ page }) => {
    await page.goto("/");

    // The page title should contain the site name
    await expect(page).toHaveTitle(/Lucferbux/i);

    // Hero section should be visible (h1 = "Hi! I'm Lucas,")
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should display the header with navigation links", async ({ page }) => {
    await page.goto("/");

    // Logo should be visible
    const logo = page.locator('img[alt="Logo Icon"]');
    await expect(logo).toBeVisible();

    // Navigation links in the header area (first matching link per route)
    await expect(page.locator('a[href="/news"]').first()).toBeVisible();
    await expect(page.locator('a[href="/projects"]').first()).toBeVisible();
    await expect(page.locator('a[href="/posts"]').first()).toBeVisible();
  });

  test("should display the footer", async ({ page }) => {
    await page.goto("/");

    // Footer contains the tracking disclaimer text
    await expect(
      page.getByText("This site does not track any information about usage")
    ).toBeVisible();
  });
});
